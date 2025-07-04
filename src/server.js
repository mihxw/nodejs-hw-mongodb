import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRouter from './routes/contacts.js';
import { getAllContact, getContactById } from './services/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

dotenv.config();

const PORT = Number(process.env.PORT);

export const setupServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use('/contacts', contactRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);
  app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
  });
};