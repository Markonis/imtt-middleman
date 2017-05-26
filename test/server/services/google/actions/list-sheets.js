var listSheets = require(process.cwd() + '/server/services/google/actions/list-sheets.js');
var expect = require('expect.js');

describe('listSheets', function() {
  describe('fetchPageApiParams', function() {
    it('returns properly formated params', function() {
      var params = {
        authClient: 'auth-client',
        mimeType: 'mime-type'
      };

      var result = listSheets.fetchPageApiParams(params, 'page-token');

      expect(result).to.eql({
        auth: 'auth-client',
        q: "mimeType='mime-type'",
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
        pageToken: 'page-token'
      });
    });
  });
});
