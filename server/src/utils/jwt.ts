import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from './keys';

export const createAccessToken = (id: string) =>
	jwt.sign({ id }, JWT_ACCESS_SECRET, { expiresIn: '30min' });

export const createRefreshToken = (id: string) =>
	jwt.sign({ id }, JWT_REFRESH_SECRET, { expiresIn: '14d' });

export const verifyAccessToken = (token: string) =>
	jwt.verify(token, JWT_ACCESS_SECRET);

export const verifyRefreshToken = (token: string) =>
	jwt.verify(token, JWT_REFRESH_SECRET);
