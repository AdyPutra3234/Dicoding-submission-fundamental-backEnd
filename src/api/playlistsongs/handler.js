class PlaylistsongsHandler {
  constructor(playlistsongsService, playlistsService, validator) {
    this._playlistsongsService = playlistsongsService;
    this._playlistService = playlistsService;
    this._validator = validator;

    this.addSongToPlaylistHandler = this.addSongToPlaylistHandler.bind(this);
    this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
  }

  async addSongToPlaylistHandler({ payload, params, auth }, h) {
    this._validator.validate(payload);

    const { id: credentialId } = auth.credentials;
    const { songId } = payload;
    const { playlistId } = params;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistsongsService.addSongToPlaylist(songId, playlistId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getSongsFromPlaylistHandler({ params, auth }) {
    const { id: credentialId } = auth.credentials;
    const { playlistId } = params;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    const songs = await this._playlistsongsService.getSongsFromPlaylist(playlistId);

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async deleteSongFromPlaylistHandler({ payload, params, auth }) {
    this._validator.validate(payload);
    const { id: credentialId } = auth.credentials;
    const { songId } = payload;
    const { playlistId } = params;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistsongsService.deleteSongFromPlaylist(songId, playlistId);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = PlaylistsongsHandler;
