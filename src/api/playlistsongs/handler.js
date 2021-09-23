class PlaylistsongsHandler {
  constructor(playlistsongsService, playlistsService, validator) {
    this._playlistsongsService = playlistsongsService;
    this._playlistService = playlistsService;
    this._validator = validator;

    this.addSongToPlaylistHandler = this.addSongToPlaylistHandler.bind(this);
    this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
  }

  async addSongToPlaylistHandler(request, h) {
    this._validator.validate(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    const { playlistId } = request.params;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistsongsService.addSongToPlaylist(songId, playlistId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getSongsFromPlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { playlistId } = request.params;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    const songs = await this._playlistsongsService.getSongsFromPlaylist(playlistId);

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async deleteSongFromPlaylistHandler(request) {
    this._validator.validate(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    const { playlistId } = request.params;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistsongsService.deleteSongFromPlaylist(songId, playlistId);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = PlaylistsongsHandler;
