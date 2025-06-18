import { User } from '../db/models/auth.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';

import {
  FIFTEEN_MINUTES,
  ONE_DAY,
  TEMPLATES_DIR,
} from '../constants/constants.js';
import { SessionAuth } from '../db/models/session.js';

import { sendEmail } from '../utils/sendEmail.js';
import { getEnvWar } from '../utils/getEnv.js';

import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

export const userRegisterService = async (payload) => {
  const isUser = await User.findOne({ email: payload.email });
  if (isUser) {
    throw createHttpError(409, 'Email in use');
  }
  const hashPassword = await bcrypt.hash(payload.password, 10);
  return await User.create({ ...payload, password: hashPassword });
};
export const userLogInService = async (payload) => {
  const isRegistered = await User.findOne({ email: payload.email });
  if (!isRegistered) {
    throw createHttpError(404, 'The user is nod available');
  }
  const isEqual = await bcrypt.compare(payload.password, isRegistered.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionAuth.deleteOne({ userId: isRegistered._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const session = await SessionAuth.create({
    userId: isRegistered._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
  return {
    accessToken,
    refreshToken,
    sessionId: session._id,
  };
};

export const refreshSession = async (sessionId, refreshToken) => {
  const session = await SessionAuth.findOne({ _id: sessionId, refreshToken });

  if (session === null) {
    throw createHttpError.Unauthorized('Session not found');
  }
  if (session.refreshToken !== refreshToken) {
    throw createHttpError.Unauthorized('Refresh token is invalid');
  }
  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError.Unauthorized('Refresh token is expired');
  }
  await SessionAuth.deleteOne({ _id: sessionId });
  return SessionAuth.create({
    userId: session.userId,
    accessToken: randomBytes(30).toString('base64'),
    refreshToken: randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const logoutUser = async (sessionId) => {
  await SessionAuth.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvWar('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();
  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${getEnvWar('APP_DOMAIN')}/reset-pwd?token=${resetToken}`,
  });
  await sendEmail({
    to: user.email,
    subject: 'Reset your password',
    html,
  });
};
export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvWar('JWT_SECRET'));
  } catch (error) {
    if (error instanceof Error) throw createHttpError(401, error.message);
    throw error;
  }

  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (!user) {
    throw createHttpError(401, 'User not found');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  await User.updateOne({ _id: user._id }, { password: encryptedPassword });
};

export const requestResetPassword = async (email) => {
  const user = await User.findOne({ email });

  const token = jwt.sign({ email }, getEnvWar('JWT_SECRET'), {
    expiresIn: '5m',
  });
  const link = `${getEnvWar('APP_DOMAIN')}/reset-password?token=${token}`;
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  await sendEmail({
    to: user.email,
    subject: 'Reset your password',
    html,
  });
};