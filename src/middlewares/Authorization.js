import createHttpError from 'http-errors';
import { SessionCollection } from '../models/session.js';
import { UserCollection } from '../models/user.js';

// import { SessionsCollection } from '../db/models/session.js';
// import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (typeof authorization !== 'string') {
    next(new createHttpError.Unauthorized('Pls provide accses token'));
  }

  const [bearer, accessToken] = authorization.split(' ', 2);

  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    next(new createHttpError.Unauthorized('Pls provide accses token'));
  }

  const session = await SessionCollection.findOne({ accessToken });

  if (session === null) {
    throw createHttpError.Unauthorized('Session not found');
  }

  if (session.accessTokenValidUntil < new Date()) {
    next(new createHttpError.Unauthorized('Accses token is expired'));
  }

  const user = await UserCollection.findOne({ _id: session.userId });

  if (user === null) next(new createHttpError.Unauthorized('User not found'));

  req.user = { id: user._id, name: user.name };

  next();
};