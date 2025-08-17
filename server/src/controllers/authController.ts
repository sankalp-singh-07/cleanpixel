import { Response, Request } from 'express';
import { createUser, findUser, getUserById } from '../lib/prisma.js';
import {
	createAccessToken,
	createRefreshToken,
	verifyRefreshToken,
} from '../utils/jwt.js';
import { UserLogin, UserSignUp } from '../types/userType.js';
import bcrypt from 'bcrypt';

const REFRESH_COOKIE_PATH = '/api/refresh';

const refreshCookieOptions = {
	httpOnly: true,
	secure: true,
	sameSite: 'none' as const,
	partitioned: true as const,
	path: REFRESH_COOKIE_PATH,
	maxAge: 14 * 24 * 60 * 60 * 1000,
};

function setRefreshCookie(res: Response, token: string) {
	res.cookie('refreshToken', token, refreshCookieOptions);
}

function clearRefreshCookie(res: Response) {
	res.clearCookie('refreshToken', {
		httpOnly: true,
		secure: true,
		sameSite: 'none',
		partitioned: true as const,
		path: REFRESH_COOKIE_PATH,
	});
}

export const login = async (req: Request, res: Response) => {
	try {
		const { user } = req.body;
		if (!user)
			return res.status(400).json({ message: 'User details not found' });

		const parsed = UserLogin.safeParse(user);
		if (!parsed.success) {
			return res
				.status(422)
				.json({ message: 'Invalid format for user details' });
		}

		const email = parsed.data.email.toLowerCase();
		const password = parsed.data.password;

		const userFound = await findUser(email);
		if (!userFound)
			return res
				.status(401)
				.json({ message: 'Invalid email or password' });

		const isMatch = await bcrypt.compare(password, userFound.password);
		if (!isMatch)
			return res
				.status(401)
				.json({ message: 'Invalid email or password' });

		const accessToken = createAccessToken(userFound.id);
		const refreshToken = createRefreshToken(userFound.id);

		setRefreshCookie(res, refreshToken);

		return res.status(200).json({
			message: 'Login successful',
			accessToken,
			user: {
				id: userFound.id,
				email: userFound.email,
				username: userFound.username,
				name: userFound.name,
			},
		});
	} catch (e) {
		console.error('[LOGIN]', e);
		return res.status(500).json({ message: 'Something went wrong' });
	}
};

export const signup = async (req: Request, res: Response) => {
	try {
		const { user } = req.body;
		if (!user)
			return res.status(400).json({ message: 'User details not found' });

		const parsed = UserSignUp.safeParse(user);
		if (!parsed.success) {
			return res
				.status(422)
				.json({ message: 'Invalid format for user details' });
		}

		const email = parsed.data.email.toLowerCase();
		const username = parsed.data.username.toLowerCase();
		const { name, password } = parsed.data;

		const existingByEmail = await findUser(email);
		const existingByUsername = await findUser(undefined, username);
		if (existingByEmail || existingByUsername) {
			return res.status(409).json({ message: 'User already registered' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await createUser(username, name, email, hashedPassword);

		return res.status(201).json({
			message: 'User created successfully',
			user: { id: newUser.id, email: newUser.email },
		});
	} catch (e) {
		console.error('[SIGNUP]', e);
		return res.status(500).json({ message: 'Signup failed' });
	}
};

export const meController = async (req: Request, res: Response) => {
	try {
		const userId = req.userId; // set by requireAuth middleware
		if (!userId)
			return res.status(401).json({ message: 'Unauthorized access' });

		const userFound = await getUserById(userId);
		if (!userFound)
			return res.status(404).json({ message: 'User not found' });

		return res.status(200).json({
			message: 'User found',
			user: {
				id: userFound.id,
				email: userFound.email,
				username: userFound.username,
				name: userFound.name,
			},
		});
	} catch (e) {
		console.error('[ME]', e);
		return res.status(500).json({ message: 'Internal server error' });
	}
};

export const refreshController = async (req: Request, res: Response) => {
	try {
		const token = req.cookies.refreshToken;
		if (!token)
			return res.status(401).json({ message: 'Refresh token missing' });

		const payload = verifyRefreshToken(token) as { id: string } | null;
		if (!payload?.id)
			return res.status(403).json({ message: 'Invalid refresh token' });

		const newRefreshToken = createRefreshToken(payload.id);
		setRefreshCookie(res, newRefreshToken);

		const newAccessToken = createAccessToken(payload.id);
		return res
			.status(200)
			.json({ message: 'Token refreshed', accessToken: newAccessToken });
	} catch (e) {
		console.error('[REFRESH]', e);
		clearRefreshCookie(res);
		return res
			.status(401)
			.json({ message: 'Invalid or expired refresh token' });
	}
};

export const logoutController = async (_req: Request, res: Response) => {
	clearRefreshCookie(res);
	return res.status(200).json({ message: 'User logged out successfully' });
};
