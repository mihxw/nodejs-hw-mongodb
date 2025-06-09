import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const PORT = Number(getEnvVar('PORT', '8080'));

export const setupServer = async () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  // app.use(
  //   pino({
  //     transport: {
  //       target: 'pino-pretty',
  //     },
  //   }),
  // );

  app.get('/', (req, res) => {
    res.send('Server is work');
  });

  app.use(contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};