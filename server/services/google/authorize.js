var googleAuth = require('google-auth-library');

module.exports = function(token) {
  var clientSecret = process.env['GOOGLE_CLIENT_SECRET'];
  var clientId = process.env['GOOGLE_CLIENT_ID'];
  var redirectUrl = process.env['GOOGLE_REDIRECT_URL'];

  var auth = new googleAuth();
  var authClient = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  authClient.credentials = JSON.parse(token);

  return authClient;
};
