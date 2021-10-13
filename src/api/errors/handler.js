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
      const { statusCode } = response.output.payload;

      if (statusCode === 401 || statusCode === 413) {
        return new ErrorResponse(h, {
          message: response.message,
          responseCode: statusCode,
        }).send();
      }

      return new ErrorResponse(h, {
        status: 'Error',
        message: 'Maaf , Server kami sedang bermasalah',
        responseCode: 500,
      }).send();
    }

    return response.continue || response;
  }
}

module.exports = ErrorHandler;
