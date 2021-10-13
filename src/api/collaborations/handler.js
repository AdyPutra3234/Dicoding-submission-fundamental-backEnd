class CollaborationsHandler {
  constructor(collaborationsSrvice, playlistsService, validator) {
    this._collaborationsService = collaborationsSrvice;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler({ payload, auth }, h) {
    this._validator.validate(payload);

    const { playlistId, userId } = payload;
    const { id: credentialId } = auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler({ payload, auth }) {
    this._validator.validate(payload);

    const { playlistId, userId } = payload;
    const { id: credentialId } = auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    const response = {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
    return response;
  }
}

module.exports = CollaborationsHandler;
