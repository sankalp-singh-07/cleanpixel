import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';

declare global {
	namespace Express {
		interface Request {
			userId?: string;
		}
	}
}

export const verifyAccessTokenMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({ message: 'No token provided' });
		}

		const token = authHeader.split(' ')[1];

		const decode = verifyAccessToken(token) as { id: string };

		if (!decode?.id) {
			return res.status(403).json({ message: 'Invalid token payload' });
		}

		req.userId = decode.id;
		console.log('✅ User authenticated:', decode.id);
		next();
	} catch (error) {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
};
