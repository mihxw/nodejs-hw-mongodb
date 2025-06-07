// import express from 'express';
import { Router } from 'express';
import { validateBody } from '../utils/validateBody.js';
import { loginSchema, registerSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
// import { getContactsController } from '../controllers/contacts.js';
// import { authMiddleware } from '../middlewares/authenticate.js';
import {
  authLoginController,
  authRegisterController,
  logoutController,
  refreshController,
} from '../controllers/auth.js';

const authRouter = Router();

// authRouter.get('/contacts', authMiddleware, getContactsController);
authRouter.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(authRegisterController),
);
authRouter.post(
  '/login',
  validateBody(loginSchema),
  ctrlWrapper(authLoginController),
);
authRouter.post('/refresh', ctrlWrapper(refreshController));
authRouter.post('/logout', ctrlWrapper(logoutController));

export default authRouter;