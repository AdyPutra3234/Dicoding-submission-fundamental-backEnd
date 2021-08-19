const Response = require('./Response');

class ErrorResponse extends Response {
  constructor(h, { status = 'fail', message, responseCode }) {
    super(h, { status, message, responseCode });
  }
}

module.exports = ErrorResponse;
