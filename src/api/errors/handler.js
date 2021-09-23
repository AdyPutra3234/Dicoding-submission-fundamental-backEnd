const ClientError = require('../../exceptions/ClientError');
const ErrorResponse = require('../../utils/responses/ErrorResponse');

class ErrorHandler {
  handle(request, h) {
    const { response } = request;

    if (response instanceof ClientError || response.output) {
      if (response.output.payload.error === 'Unauthorized') {
        return new ErrorResponse(h, {
          message: response.message,
          responseCode: response.output.statusCode,
        }).send();
      }
      return new ErrorResponse(h, {
        message: response.message,
        responseCode: response.statusCode,
      }).send();
    }

    if (response instanceof Error) {
      return new ErrorResponse(h, {
        status: 'Error',
        message: response.message,
        responseCode: 500,
      }).send();
    }

    return response.continue || response;
  }
}

module.exports = ErrorHandler;
