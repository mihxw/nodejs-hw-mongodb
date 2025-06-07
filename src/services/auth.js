import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../db/models/User.js';
import { Session } from '../db/models/Session.js';
import { randomBytes } from 'crypto';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/auth.js';

const createSession = () => {
  const accessToken = randomBytes(32).toString('hex');
  const refreshToken = randomBytes(32).toString('hex');
  const accessTokenValidUntil = Date.now() + accessTokenLifeTime;
  const refreshTokenValidUntil = Date.now() + refreshTokenLifeTime;
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const findSession = (query) => Session.findOne(query);
export const findUserById = (query) => User.findOne(query);

// const SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const registerUser = async (payload) => {
  const { email, password } = payload;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await User.create({ ...payload, password: hashedPassword });
};

// const newUser = await User.create({
//   name,
//   email,
//   password: hashedPassword,
// });

//   const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: '1h' });

//   const { password: _, ...userWithoutPassword } = newUser.toObject();

//   return { ...userWithoutPassword, token };
// };

export const loginUser = async (payload) => {
  const { email, password } = payload;

  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  await Session.findOneAndDelete({ userId: user._id });

  const session = createSession();
  return await Session.create({
    userId: user._id,
    ...session,
  });
};

export const refreshUser = async ({ refreshToken, sessionId }) => {
  const session = await findSession({ refreshToken, _id: sessionId });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  if (session.refreshTokenValidUntil < Date.now()) {
    await Session.findOneAndDelete({ _id: session._id });
    throw createHttpError(401, 'Session token expired');
  }

  await Session.findOneAndDelete({ _id: session._id });

  const newSession = createSession();

  return Session.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};
// const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });

//   const { password: _, ...userWithoutPassword } = user.toObject();
//   return { ...userWithoutPassword, token };
// };

// export const loginUser = async ({ email, password }) => {
//   const user = await User.findOne({ email });

//   if (!user) throw createHttpError(401, 'Invalid email or password');

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) throw createHttpError(401, 'Invalid email or password');

//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: '1d',
//   });

//   user.token = token;
//   await user.save();

//   return {
//     token,
//     user: {
//       name: user.name,
//       email: user.email,
//       _id: user._id
//     }
//   };
// };