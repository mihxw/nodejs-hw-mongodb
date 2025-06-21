import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './src/validation/server.js';

const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};

bootstrap();