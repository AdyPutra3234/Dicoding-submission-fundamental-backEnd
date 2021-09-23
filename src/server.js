require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const TokenManager = require('./tokenize/TokenManager');
const Validator = require('./validator/Validator');

// Songs
const songsPlugin = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const { SongPayloadSchema } = require('./validator/payloadSchemas/songSchema');

// Users
const usersPlugin = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const { UserPayloadSchema } = require('./validator/payloadSchemas/userSchema');

// Authentications
const authenticationsPlugin = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const {
  PostAuthenticationPayloadSchema,
  PuttAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} = require('./validator/payloadSchemas/authenticationSchema');

// Playlists
const playlistsPlugin = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const { PostPlaylistPayloadSchema } = require('./validator/payloadSchemas/playlistSchema');

// Playlistsongs
const playlistsongsPlugin = require('./api/playlistsongs');
const PlaylistSongsService = require('./services/postgres/PlaylistsongsService');
const { PlaylistsongsPayloadSchema } = require('./validator/payloadSchemas/playlistsongsSchema');

// Collaborations
const collaborationsPlugin = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const { CollaborationsPayloadSchema } = require('./validator/payloadSchemas/collaborationsSchema');

// ErrorHandler
const errorHandlerPlugin = require('./api/errors');

const init = async () => {
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const tokenManager = new TokenManager();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const songsService = new SongsService();
  const playlistsongsService = new PlaylistSongsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('openMusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: errorHandlerPlugin,
    },
    {
      plugin: songsPlugin,
      options: {
        service: songsService,
        validator: new Validator(SongPayloadSchema),
      },
    },
    {
      plugin: usersPlugin,
      options: {
        service: usersService,
        validator: new Validator(UserPayloadSchema),
      },
    },
    {
      plugin: authenticationsPlugin,
      options: {
        usersService,
        authenticationsService,
        tokenManager,
        validators: {
          post: new Validator(PostAuthenticationPayloadSchema),
          put: new Validator(PuttAuthenticationPayloadSchema),
          delete: new Validator(DeleteAuthenticationPayloadSchema),
        },
      },
    },
    {
      plugin: playlistsPlugin,
      options: {
        service: playlistsService,
        validator: new Validator(PostPlaylistPayloadSchema),
      },
    },
    {
      plugin: playlistsongsPlugin,
      options: {
        playlistsongsService,
        playlistsService,
        validator: new Validator(PlaylistsongsPayloadSchema),
      },
    },
    {
      plugin: collaborationsPlugin,
      options: {
        collaborationsService,
        playlistsService,
        validator: new Validator(CollaborationsPayloadSchema),
      },
    },
  ]);

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init();
