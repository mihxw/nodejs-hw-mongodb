import { ONE_DAY } from '../constants/index.js';
import {
  loginOrRegister,
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
  resetPassword,
  sendResetPassword,
} from '../servis/auth.js';
import { getOAuthURL, validateCode } from '../utils/googleOauth.js';

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

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.status(201).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;
  if (typeof sessionId === 'string') await logoutUser(sessionId, refreshToken);

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).end();
};

export const refreshSessionuserController = async (req, res) => {
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

export const sendResetPasswordController = async (req, res) => {
  const { email } = req.body;

  await sendResetPassword(email);

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
  });
};

export const resetPassworsController = async (req, res) => {
  const { password, token } = req.body;
  console.log(req.body);

  await resetPassword(password, token);

  res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};

export function getOauthController(req, res) {
  const url = getOAuthURL();

  res.json({
    status: 200,
    message: 'Successfully get url',
    data: {
      oauth_url: url,
    },
  });
}

export async function confirmOAuthSchemaController(req, res) {
  const ticket = await validateCode(req.body.code);

  const session = await loginOrRegister(
    ticket.payload.email,
    ticket.payload.name,
  );

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Login with Google successfully',
    data: {
      accessToken: session.accessToken,
    },
  });
}