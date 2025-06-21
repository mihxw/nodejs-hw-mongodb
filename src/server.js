import path from 'node:path';
import express from 'express'; // ← Це обов'язково!
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';

const PORT = Number(getEnvVar('PORT', '8080'));

export const setupServer = async () => {
  const app = express(); // ← Тут використовується express

  app.use(
    '/avatars',
    express.static(path.resolve('src', 'uploads', 'avatars')),
  );

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  app.get('/', (req, res) => {
    res.send('Server is working');
  });

  app.use(router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};
