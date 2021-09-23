const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InVariantError = require('../../exceptions/InVariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist(songId, playlistId) {
    const id = `playlistsongs-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new InVariantError('Gagal menambahkan lagu ke playlist');

    return result.rows[0].id;
  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM playlistsongs RIGHT JOIN songs ON songs.id = song_id WHERE playlist_id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Playlist tidak ditemukan');

    return result.rows;
  }

  async deleteSongFromPlaylist(songId, playlistId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE song_id = $1 AND playlist_id = $2',
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new InVariantError('Lagu gagal dihapus, Id lagu tidak ditemukan');
  }
}

module.exports = PlaylistSongsService;
