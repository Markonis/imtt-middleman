var express = require('express');
var google = require('./services/google/google.js');
var bodyParser = require('body-parser');

function googleRequestHandler(actionName) {
  var action = google[actionName];
  return function(req, res) {
    if (action.validateParams(req.body)) {
      action.handleRequest(req.body)
        .then(function(result) {
          res.json(result);
        })
        .catch(function(err) {
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

    router.post('/google/sheets/list', googleRequestHandler('listSheets'));
    router.post('/google/sheets/update', googleRequestHandler('updateSheetValue'));

    app.use('/api', router);
  }
};
