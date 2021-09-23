/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlistsongs', {
    id: {
      type: 'VARCHAR(50)',
      notNull: true,
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(30)',
      notNull: true,
    },
  });

  pgm.addConstraint('playlistsongs', 'unique_playlist_id_and_song_id', 'UNIQUE(playlist_id, song_id)');
  pgm.addConstraint('playlistsongs', 'fk_playlistsongs.playlist_id-playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlistsongs', 'fk_playlistsongs.song_id-songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlistsongs', 'fk_playlistsongs.playlist_id-playlists.id');
  pgm.dropConstraint('playlistsongs', 'fk_playlistsongs.song_id-songs.id');
  pgm.dropTable('playlistsongs');
};
