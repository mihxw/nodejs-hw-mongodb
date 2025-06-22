import * as fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';

const SWAGGER_DOCS = JSON.parse(
  fs.readFileSync(path.join('docs', 'swagger.json'), 'utf-8'),
);

const PORT = Number(getEnvVar('PORT', '8080'));

export const setupServer = async () => {
  const app = express();

  app.use(
    '/avatars',
    express.static(path.resolve('src', 'uploads', 'avatars')),
  );

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  app.get('/', (req, res) => {
    res.send('Server is work');
  });

  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(SWAGGER_DOCS));

  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};