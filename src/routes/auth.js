import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  userRegisterController,
  userLogInController,
  userLogOutController,
  refreshController,
  requestResetEmailController,
  requestResetPasswordController,
  resetPasswordController,
} from '../controllers/authController.js';

import { validateBody } from '../middlewares/validateBody.js';
import {
  logInUserSchema,
  registerUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(userRegisterController),
);

router.post(
  '/logIn',
  validateBody(logInUserSchema),
  ctrlWrapper(userLogInController),
);

router.post('/refresh', ctrlWrapper(refreshController));

router.post('/logout', ctrlWrapper(userLogOutController));

router.post(
  '/send-reset-email',

  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetPasswordController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);
export default router;