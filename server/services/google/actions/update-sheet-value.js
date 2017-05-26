var google = require('googleapis');
var sheets = google.sheets('v4');
var _ = require('underscore');
var authorize = require('../authorize.js');
var Ajv = require('ajv');

function loadRowsApiParams(params) {
  return {
    auth: params.authClient,
    spreadsheetId: params.sheetId,
    range: params.page + '!' + params.keyColumn + ':' + params.keyColumn
  };
}

function loadRows(params) {
  var apiParams = loadRowsApiParams(params);
  return new Promise(function(resolve, reject) {
    sheets.spreadsheets.values.get(apiParams, function(err, response) {
      if (err) {
        reject('Could not fetch sheets data');
      }
      else {
        resolve(response.values);
      }
    });
  });
}

function findRowIndex(params) {
  return function(rows) {
    var index = _.findIndex(rows, function(row) {
      return row[0] == params.keyValue;
    });

    if (index > -1) {
      return Promise.resolve(index + 1);
    }
    else {
      return Promise.reject('Cannot find the row.');
    }
  };
}

function updateValueRange(params, rowIndex) {
  var cell = params.valueColumn + rowIndex;
  return params.page + '!' + cell + ':' + cell;
}

function updateValueApiParams(params, rowIndex) {
  var range = updateValueRange(params, rowIndex);
  return {
    auth: params.authClient,
    spreadsheetId: params.sheetId,
    range: range,
    valueInputOption: 'RAW',
    resource: {
      range: range,
      majorDimension: 'ROWS',
      values: [[params.value]]
    }
  };
}

function updateValue(params) {
  return function(rowIndex) {
    var apiParams = updateValueApiParams(params, rowIndex);
    return new Promise(function(resolve, reject) {
      sheets.spreadsheets.values.update(apiParams, function(err, response) {
        if (err) {
          reject('Could not update sheets data');
        }
        else {
          resolve(response);
        }
      });
    });
  };
}

function compileParamsValidator() {
  var schema = {
    type: 'object',
    properties: {
      token: {
        type: 'string',
      },
      sheet_id: {
        type: 'string',
      },
      page: {
        type: 'string',
      },
      key_column: {
        type: 'string',
      },
      key_value: {
        type: 'string',
      },
      value_column: {
        type: 'string',
      },
      value: {
        type: 'string'
      }
    },
    required: [
      'token', 'sheet_id', 'page', 'key_column',
      'key_value', 'value_column', 'value'
    ]
  };
  var ajv = new Ajv();
  return ajv.compile(schema);
}

var validateParams = compileParamsValidator();

function handleRequest(params) {
  var authClient = authorize(params.token);
  return loadRows({
      authClient: authClient,
      sheetId: params.sheet_id,
      page: params.page,
      keyColumn: params.key_column
    }).then(findRowIndex({
      keyValue: params.key_value
    }))
    .then(updateValue({
      authClient: authClient,
      sheetId: params.sheet_id,
      page: params.page,
      valueColumn: params.value_column,
      value: params.value
    }));
}

module.exports = {
  loadRowsApiParams: loadRowsApiParams,
  updateValueRange: updateValueRange,
  updateValueApiParams: updateValueApiParams,
  validateParams: validateParams,
  handleRequest: handleRequest
};
