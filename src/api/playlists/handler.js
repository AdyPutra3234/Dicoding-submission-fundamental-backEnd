class PlyalistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
  }

  async postPlaylistHandler({ payload, auth }, h) {
    this._validator.validate(payload);

    const { name: playlistName } = payload;
    const { id: credentialId } = auth.credentials;

    const playlistId = await this._service.addPlaylist(playlistName, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler({ auth }) {
    const { id: credentialId } = auth.credentials;

    const playlists = await this._service.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler({ params, auth }) {
    const { playlistId } = params;
    const { id: credentialId } = auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);

    await this._service.deletePlaylistById(playlistId);
    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }
}

module.exports = PlyalistsHandler;
