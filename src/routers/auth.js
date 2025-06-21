import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  userRegisterController,
  userLogInController,
  userLogOutController,
  refreshController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserSchema,
  registerUserSchema,
  sendResetPasswordSchema,
  resetPasswordSchema,
} from '../validation/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(userRegisterController)
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(userLogInController)
);

router.post('/refresh', ctrlWrapper(refreshController));

router.post('/logout', ctrlWrapper(userLogOutController));

router.post(
  '/send-reset-email',
  validateBody(sendResetPasswordSchema),
  ctrlWrapper(requestResetEmailController)
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController)
);

router.use((req, res, next) => {
  console.log('Auth router hit:', req.method, req.url);
  next();
});


export default router;
