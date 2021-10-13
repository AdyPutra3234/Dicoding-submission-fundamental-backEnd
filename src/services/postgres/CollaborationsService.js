const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InVariantError = require('../../exceptions/InVariantError');

class CollaborationsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new InVariantError('Kolaborasi gagal ditambahkan');

    await this._cacheService.delete([`songs:${playlistId}`, `playlists:${userId}`]);

    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) throw new InVariantError('Kolaborasi gagal dihapus');

    await this._cacheService.delete([`songs:${playlistId}`, `playlists:${userId}`]);
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) throw new InVariantError('Kolaborasi gagal diverifikasi');
  }
}

module.exports = CollaborationsService;
