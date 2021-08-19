const ClientError = require('../../exceptions/ClientError');
const ErrorResponse = require('../../utils/responses/ErrorResponse');

class ErrorHandler {
  handle(request, h) {
    const { response } = request;

    if (response instanceof ClientError) {
      return new ErrorResponse(h, {
        message: response.message,
        responseCode: response.statusCode,
      }).send();
    }

    if (response instanceof Error) {
      return new ErrorResponse(h, {
        status: 'Error',
        message: 'Terjadi kegagalan pada server',
        responseCode: 500,
      }).send();
    }

    return response.continue || response;
  }
}

module.exports = ErrorHandler;
