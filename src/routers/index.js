import express from 'express';
import contactRouter from './contacts.js';
import authRouter from './auth.js';
import { authenticate } from '../middlewares/Authorization.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/contacts', authenticate, contactRouter);

export default router;