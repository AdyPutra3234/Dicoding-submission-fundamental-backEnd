require('dotenv').config();

const Hapi = require('@hapi/hapi');
const songsPlugin = require('./api/songs');
const errorHandlerPlugin = require('./api/errors');
const SongsValidator = require('./validator/songs');
const SongsService = require('./services/postgres/SongsService');
const { SongPayloadSchema } = require('./validator/songs/schema');

const init = async () => {
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
      plugin: songsPlugin,
      options: {
        service: new SongsService(),
        validator: new SongsValidator(SongPayloadSchema),
      },
    },
    {
      plugin: errorHandlerPlugin,
    },
  ]);

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init();
