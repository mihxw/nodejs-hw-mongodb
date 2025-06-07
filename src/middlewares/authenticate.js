// import jwt from 'jsonwebtoken';
// import createHttpError from 'http-errors';
// import { User } from '../db/models/User.js';

// export const authMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization || '';
//     const [type, token] = authHeader.split(' ');

//     if (type !== 'Bearer' || !token) {
//       throw createHttpError(401, 'Not authorized');
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       throw createHttpError(401, 'User not found');
//     }

//     req.user = user; // <--- ось тут додається req.user
//     next();
//   } catch (error) {
//     next(createHttpError(401, 'Invalid token'));
//   }
// };
// import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { findSession, findUserById } from '../services/auth.js';
// import { User } from '../db/models/User.js';


export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const [bearer, accessToken] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    return next(createHttpError(401, 'Header must have type Bearer'));
  }
  const session = await findSession({ accessToken });
  if (!session) {
    return next(createHttpError(401, 'Session not fount'));
  }
  if (session.accessTokenValidUntil < Date.now) {
    return next(createHttpError(401, 'Access token expired'));
  }
  const user = await findUserById({ _id: session.userId });
  
  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }
  req.user = user;
  next();
};