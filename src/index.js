import dotenv from 'dotenv';
dotenv.config(); // обов'язково на самому верху

import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const startApp = async () => {
  await initMongoConnection();
  setupServer();
};

startApp().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});