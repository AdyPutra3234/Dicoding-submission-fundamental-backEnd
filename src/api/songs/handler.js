const SuccessResponse = require('../../utils/responses/SuccessResponse');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.editSongByIdHandler = this.editSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler({ payload }, h) {
    this._validator.validate(payload);

    const songId = await this._service.addSong(payload);

    const response = new SuccessResponse(h, {
      responseCode: 201,
      message: 'Lagu Berhasil ditambahkan',
      data: {
        songId,
      },
    });

    return response.send();
  }

  async getSongsHandler(_, h) {
    const songs = await this._service.getSongs();

    const response = new SuccessResponse(h, {
      data: {
        songs,
      },
    });

    return response.send();
  }

  async getSongByIdHandler({ params }, h) {
    const { songId } = params;

    const song = await this._service.getDetailSongById(songId);

    const response = new SuccessResponse(h, {
      data: {
        song,
      },
    });

    return response.send();
  }

  async editSongByIdHandler({ payload, params }, h) {
    this._validator.validate(payload);

    const { songId } = params;

    await this._service.editSongById(songId, payload);

    const response = new SuccessResponse(h, {
      message: 'Lagu berhasil diperbarui',
    });

    return response.send();
  }

  async deleteSongByIdHandler({ params }, h) {
    const { songId } = params;

    await this._service.deleteSongById(songId);

    const response = new SuccessResponse(h, {
      message: 'Lagu berhasil dihapus',
    });

    return response.send();
  }
}

module.exports = SongsHandler;
