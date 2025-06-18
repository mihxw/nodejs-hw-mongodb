import {
  logoutUser,
  userLogInService,
  refreshSession,
  userRegisterService,
  requestResetToken,
  requestResetPassword,
  resetPassword,
} from '../services/user.js';
import { ONE_DAY, FIFTEEN_MINUTES } from '../constants/constants.js';
import nodeMailerService from '../services/nodeMailerService.js';

export const userRegisterController = async (req, res) => {
  const user = await userRegisterService(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const userLogInController = async (req, res) => {
  const session = await userLogInService(req.body);
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session.sessionId, {
    httpOnly: true,
    expires: new Date(Date.now() + FIFTEEN_MINUTES),
  });
  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  const session = await refreshSession(sessionId, refreshToken);
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const userLogOutController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send();
};

export const sendRefreshEmailContoller = async (req, res) => {
  const { email } = req.body;
  const mail = nodeMailerService.mailOptionGenerator({
    from: 'oleg.dr.ua1@gmail.com',
    to: email,
    subject: 'refresh',
    text: 'text',
  });
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent',
    data: {},
  });
};

export const requestResetPasswordController = async (req, res) => {
  const { email } = req.body;

  await requestResetToken(email);

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    status: 200,
    message: 'Password was successfully reset!',
    data: {},
  });
};