class ExportsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validate(request.payload);

    const userId = request.auth.credentials.id;
    const { playlistId } = request.params;
    const { targetEmail } = request.payload;

    const message = {
      playlistId,
      targetEmail,
    };

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    await this._service.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
