import path from 'node:path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import router from './routers/index.js';

const PORT = Number(getEnvVar('PORT', '8080'));

const app = express();

app.use(
  '/avatars',
  express.static(path.resolve('src', 'uploads', 'avatars'))
);

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Логування запитів — щоб дебаг було легше
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Server is working');
});

app.use(router);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
