var expect = require('expect.js');
var updateSheetValue = require(process.cwd() + '/server/services/google/actions/update-sheet-value.js');

describe('updateSheetValue', function() {
  describe('loadRowsApiParams', function() {
    it('returns properly formated params', function() {
      var result = updateSheetValue.loadRowsApiParams({
        authClient: 'auth-client',
        sheetId: 'sheet-id',
        page: 'Page',
        keyColumn: 'B'
      });

      expect(result).to.eql({
        auth: 'auth-client',
        spreadsheetId: 'sheet-id',
        range: 'Page!B:B'
      });
    });
  });

  describe('updateValueRange', function() {
    it('returns properly formated range in A1 notation', function() {
      var result = updateSheetValue.updateValueRange({
        page: 'Page',
        valueColumn: 'B'
      }, 10);

      expect(result).to.eql('Page!B10:B10');
    });
  });

  describe('updateValueApiParams', function() {
    it('returns properly formated params', function() {
      var result = updateSheetValue.updateValueApiParams({
        authClient: 'auth-client',
        sheetId: 'sheet-id',
        page: 'Page',
        valueColumn: 'C',
        value: 'VALUE'
      }, 12);

      expect(result).to.eql({
        auth: 'auth-client',
        spreadsheetId: 'sheet-id',
        range: 'Page!C12:C12',
        valueInputOption: 'RAW',
        resource: {
          range: 'Page!C12:C12',
          majorDimension: 'ROWS',
          values: [['VALUE']]
        }
      });
    });
  });

  describe('validateParams', function() {
    it('returns true if params are valid', function() {
      var params = {
        token: 'abc',
        sheet_id: 'abc',
        page: 'abc',
        key_column: 'abc',
        key_value: 'abc',
        value_column: 'abc',
        value: 'abc'
      };

      var result = updateSheetValue.validateParams(params);
      expect(result).to.be(true);
    });
  });
});
