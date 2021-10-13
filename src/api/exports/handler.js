class ExportsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler({ payload, params, auth }, h) {
    this._validator.validate(payload);

    const userId = auth.credentials.id;
    const { playlistId } = params;
    const { targetEmail } = payload;

    const message = {
      playlistId,
      targetEmail,
    };

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    await this._service.sendMessage('export:songs', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
