import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from './keys';

export const createAccessToken = (id: string) => {
	return jwt.sign({ id }, JWT_ACCESS_SECRET, { expiresIn: '30min' });
};

export const createRefreshToken = (id: string) => {
	return jwt.sign({ id }, JWT_REFRESH_SECRET, { expiresIn: '14d' });
};

export const verifyAccessToken = (token: string) => {
	return jwt.verify(token, JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
	return jwt.verify(token, JWT_REFRESH_SECRET);
};
