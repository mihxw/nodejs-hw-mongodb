import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  confirmOAuthSchemaController,
  getOauthController,
  loginUserController,
  logoutUserController,
  refreshSessionuserController,
  registerUserController,
  resetPassworsController,
  sendResetPasswordController,
} from '../controllers/auth.js';
import {
  confirmOAuthSchema,
  loginUserSchema,
  registerUserSchema,
  resetPassworsSchema,
  sendResetPassword,
} from '../validation/auth.js';

const router = express.Router();

const jsonParser = express.json();

router.post(
  '/register',
  jsonParser,
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  jsonParser,
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', ctrlWrapper(logoutUserController));

router.post('/refresh', ctrlWrapper(refreshSessionuserController));

router.post(
  '/send-reset-email',
  jsonParser,
  validateBody(sendResetPassword),
  ctrlWrapper(sendResetPasswordController),
);

router.post(
  '/reset-pwd',
  jsonParser,
  validateBody(resetPassworsSchema),
  ctrlWrapper(resetPassworsController),
);

router.get('/get-oauth-url', ctrlWrapper(getOauthController));

router.post(
  '/confirm-oauth',
  jsonParser,
  validateBody(confirmOAuthSchema),
  ctrlWrapper(confirmOAuthSchemaController),
);

export default router;