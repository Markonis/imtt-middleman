var winston = require('winston');

// Setup file logging
winston.add(winston.transports.File, {
  filename: process.cwd() + '/log/server.log',
  level: 'debug'
});

module.exports = {
  info: function(message, meta) {
    winston.info(message, meta);
  },
  error: function(message, meta) {
    winston.error(message, meta);
  },
  verbose: function(message, meta) {
    winston.verbose(message, meta);
  }
};
