import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

const start = async () => {
  await initMongoConnection();
  await setupServer();
};

start();