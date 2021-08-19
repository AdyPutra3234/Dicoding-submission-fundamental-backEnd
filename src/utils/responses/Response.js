class Response {
  constructor(h, options) {
    this._hapi = h;
    this._options = options;
  }

  send() {
    const { status, message, data, responseCode } = this._options;
    const responseTemplate = {
      status,
    };

    if (message) responseTemplate.message = message;
    if (data) responseTemplate.data = data;

    const response = this._hapi.response(responseTemplate);
    response.code(responseCode);
    return response;
  }
}

module.exports = Response;
