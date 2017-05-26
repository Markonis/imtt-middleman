var Ajv = require('ajv');
var authorize = require('../authorize.js');
var google = require('googleapis');
var drive = google.drive('v3');
var _ = require('underscore');

function compileParamsValidator() {
  var schema = {
    type: 'object',
    properties: {
      token: {
        type: 'string',
      }
    },
    required: ['token']
  };
  var ajv = new Ajv();
  return ajv.compile(schema);
}

var validateParams = compileParamsValidator();

function fetchPageApiParams(params, pageToken) {
  return {
    auth: params.authClient,
    q: "mimeType='" + params.mimeType + "'",
    fields: 'nextPageToken, files(id, name)',
    spaces: 'drive',
    pageToken: pageToken
  };
}

function addFilesToArray(accumulator, files) {
  var processed = _.map(files, function(file) {
    return {
      name: file.name,
      id: file.id
    };
  });
  return accumulator.concat(processed);
}

function fetchPage(params, callback, pageToken, accumulator) {
  var apiParams = fetchPageApiParams(params, pageToken);
  drive.files.list(apiParams, function(err, res) {
    if (err) {
      callback(err);
    }
    else {
      if (!_.isArray(accumulator)) accumulator = [];
      accumulator = addFilesToArray(accumulator || [], res.files);
      if (res.nextPageToken) {
        fetchPage(params, callback, res.nextPageToken, accumulator);
      }
      else {
        callback(null, accumulator);
      }
    }
  });
}

function fetchAll(params) {
  return new Promise(function(resolve, reject) {
    fetchPage(params, function(err, res) {
      if (err) {
        reject('Could not fetch Drive files');
      }
      else {
        resolve(res);
      }
    });
  });
}

function handleRequest(params) {
  var authClient = authorize(params.token);
  return fetchAll({
    authClient: authClient,
    mimeType: 'application/vnd.google-apps.spreadsheet'
  });
}

module.exports = {
  fetchPageApiParams: fetchPageApiParams,
  validateParams: validateParams,
  handleRequest: handleRequest
};
