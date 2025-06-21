import createHttpError from 'http-errors';
import Handlebars from 'handlebars';
import bcrypt from 'bcrypt';
import * as fs from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';

import { UserCollection } from '../models/user.js';
import { SessionCollection } from '../models/Session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendMail } from '../utils/sendMail.js';

const RESET_PASSWORD = fs.readFileSync(
  path.resolve('src', 'templates', 'reset-password.hbs'),
  'utf-8',
);

export const registerUser = async (payload) => {
  console.log('Payload in registerUser:', payload);

  const user = await UserCollection.findOne({ email: payload.email });

  if (user !== null) {
    throw createHttpError.Conflict('Email in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  const registerUser = await UserCollection.create(payload);
  return registerUser;
};

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });

  if (user === null)
    throw createHttpError.Unauthorized('Email or password is incorrect');

  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (isEqual !== true)
    throw createHttpError.Unauthorized('Email or password is incorrect');

  await SessionCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

export const refreshUsersSession = async (sessionId, refreshToken) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (session === null) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const sendResetPassword = async (email) => {
  const user = await UserCollection.findOne({ email });

  if (user === null) throw createHttpError.NotFound('User not found!');

  const html = Handlebars.compile(RESET_PASSWORD);
  const token = jwt.sign(
    {
      sub: user._id,
      name: user.name,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );
  sendMail(
    user.email,
    'Reset password',
    html({
      link: ` ${getEnvVar('APP_DOMAIN')}/?token=${token}`,
    }),
  );
};

export const resetPassword = async (password, token) => {
  try {
    const decoder = jwt.verify(token, getEnvVar('JWT_SECRET'));

    const user = await UserCollection.findById(decoder.sub);

    if (user === null) throw createHttpError.NotFound('User not found!');

    const hashPassword = await bcrypt.hash(password, 10);

    await UserCollection.findByIdAndUpdate(user._id, {
      password: hashPassword,
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new createHttpError.Unauthorized('Token is unauthorized');
    }

    if (error.name === 'TokenExpiredError') {
      throw new createHttpError.Unauthorized('Token is expired or invalid.');
    }

    throw error;
  }
};