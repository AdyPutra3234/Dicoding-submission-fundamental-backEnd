const ErrorHandler = require('./handler');

module.exports = {
  name: 'Error Handler',
  version: '1.0.0',
  register: (server) => {
    const errorHandler = new ErrorHandler().handle;
    server.ext('onPreResponse', errorHandler);
  },
};
