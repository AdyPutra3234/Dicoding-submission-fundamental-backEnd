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

  async postSongHandler(request, h) {
    this._validator.validate(request.payload);

    const songId = await this._service.addSong(request.payload);

    const response = new SuccessResponse(h, {
      responseCode: 201,
      message: 'Lagu Berhasil ditambahkan',
      data: {
        songId,
      },
    });

    return response.send();
  }

  async getSongsHandler(request, h) {
    const songs = await this._service.getSongs();

    const response = new SuccessResponse(h, {
      data: {
        songs,
      },
    });

    return response.send();
  }

  async getSongByIdHandler(request, h) {
    const { songId } = request.params;

    const song = await this._service.getDetailSongById(songId);

    const response = new SuccessResponse(h, {
      data: {
        song,
      },
    });

    return response.send();
  }

  async editSongByIdHandler(request, h) {
    this._validator.validate(request.payload);

    const { songId } = request.params;

    await this._service.editSongById(songId, request.payload);

    const response = new SuccessResponse(h, {
      message: 'Lagu berhasil diperbarui',
    });

    return response.send();
  }

  async deleteSongByIdHandler(request, h) {
    const { songId } = request.params;

    await this._service.deleteSongById(songId);

    const response = new SuccessResponse(h, {
      message: 'Lagu berhasil dihapus',
    });

    return response.send();
  }
}

module.exports = SongsHandler;
