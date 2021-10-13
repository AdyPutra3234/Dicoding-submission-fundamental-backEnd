const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InVariantError = require('../../exceptions/InVariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor(collaborationsService, cacheService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
    this._cacheService = cacheService;
  }

  async addSongToPlaylist(songId, playlistId) {
    const id = `playlistsongs-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new InVariantError('Gagal menambahkan lagu ke playlist');

    await this._cacheService.delete(`songs:${playlistId}`);

    return result.rows[0].id;
  }

  async getSongsFromPlaylist(playlistId) {
    try {
      const result = await this._cacheService.get(`songs:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: 'SELECT songs.id, songs.title, songs.performer FROM playlistsongs RIGHT JOIN songs ON songs.id = song_id WHERE playlist_id = $1',
        values: [playlistId],
      };

      const result = await this._pool.query(query);

      if (!result.rowCount) throw new NotFoundError('Playlist tidak ditemukan');

      await this._cacheService.set(`songs:${playlistId}`, JSON.stringify(result.rows));

      return result.rows;
    }
  }

  async deleteSongFromPlaylist(songId, playlistId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE song_id = $1 AND playlist_id = $2',
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new InVariantError('Lagu gagal dihapus, Id lagu tidak ditemukan');

    await this._cacheService.delete(`songs:${playlistId}`);
  }
}

module.exports = PlaylistSongsService;
