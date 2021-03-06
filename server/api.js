var express = require('express');
var bodyParser = require('body-parser');
var google = require('./services/google/google.js');
var logger = require('./logger.js');

function logRequest(req, res, next) {
  logger.info('API Request');
  logger.verbose('Request Body', req.body);
  next();
}

function googleRequestHandler(actionName) {
  var action = google[actionName];
  return function(req, res) {
    if (action.validateParams(req.body)) {
      action.handleRequest(req.body)
        .then(function(result) {
          logger.info('API Response');
          logger.verbose('Response Body', result);
          res.json(result);
        })
        .catch(function(err) {
          logger.error('API Error', err);
          res.status(500).json(err);
        });
    }
    else {
      res.sendStatus(400);
    }
  };
}

module.exports = {
  init: function(app) {
    var router = express.Router();
    router.use(bodyParser.json());

    router.use(logRequest);

    router.post('/google/sheets/list', googleRequestHandler('listSheets'));
    router.post('/google/sheets/update', googleRequestHandler('updateSheetValue'));

    app.use('/api', router);
  }
};
