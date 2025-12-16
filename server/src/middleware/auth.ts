import { verify } from 'hono/jwt';
import EnValidator from '../utils/env.js';
import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { StatusCodes } from 'http-status-codes';
import { COOKIE_TOKE_NAME } from '../constants/cookie.js';

const JWT_SECRET = EnValidator.getValue('JWT_SECRET');

export const AuthMiddleware = async (c: Context, next: Next) => {
  try {
    const token = getCookie(c, COOKIE_TOKE_NAME);

    if (!token) {
      return c.json({ message: 'Unauthorized' }, StatusCodes.UNAUTHORIZED);
    }

    const decodedPayload = await verify(token, JWT_SECRET);

    if (!decodedPayload) {
      return c.json({ message: 'Unauthorized' }, StatusCodes.UNAUTHORIZED);
    }

    await next();
  } catch (error) {
    return c.json({ message: 'Unauthorized' }, StatusCodes.UNAUTHORIZED);
  }
};
