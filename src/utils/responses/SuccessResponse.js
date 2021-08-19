const Response = require('./Response');

class SuccessResponse extends Response {
  constructor(h, { status = 'success', message, data, responseCode = 200 }) {
    super(h, { status, message, data, responseCode });
  }
}

module.exports = SuccessResponse;
