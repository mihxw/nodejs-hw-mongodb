import express from 'express';
import cors from 'cors';
import contactRouter from './routers/contacts.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';

export const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use('/auth', authRouter);
  app.use('/contacts', contactRouter);
  app.use('/contacts/:id', contactRouter);
  app.use(notFoundHandler);     
  app.use(errorHandler);  
  const port = Number(getEnvVar('PORT', 3000));
  app.listen(port, () => console.log(`Server is running on port ${port}`));
};