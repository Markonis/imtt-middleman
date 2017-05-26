var express = require('express');
var api = require('./api.js');

// Initialize API
var app = express();
api.init(app);

// Start the server
var port = process.env['PORT'];
app.listen(port, function() {
  console.log('Listening on port: ' + port);
});
