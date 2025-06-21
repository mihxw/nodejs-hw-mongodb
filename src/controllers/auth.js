import { ONE_DAY } from '../constants/index.js';
import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
  sendResetPassword,
  resetPassword,
} from '../servis/auth.js';

export const userRegisterController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const userLogInController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const userLogOutController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;
  if (typeof sessionId === 'string') await logoutUser(sessionId, refreshToken);

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).end();
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const refreshController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;
  const session = await refreshUsersSession(sessionId, refreshToken);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const requestResetEmailController = async (req, res) => {
  const { email } = req.body;

  await sendResetPassword(email);

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
  });
};

export const requestResetPasswordController = async (req, res) => {
  // Якщо окремо потрібен — можеш додати логіку, або забрати цей контролер, якщо він дублює sendResetPassword
  res.status(501).json({ message: 'Not implemented' });
};

export const resetPasswordController = async (req, res) => {
  const { password, token } = req.body;

  await resetPassword(password, token);

  res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
