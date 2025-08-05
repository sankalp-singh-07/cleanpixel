import express from 'express';
import { UserLogin, UserSignUp } from '../types/userType.js';
import bcrypt from 'bcrypt';
import { createUser, findUser, getUserById } from '../lib/prisma.js';
import {
	createAccessToken,
	createRefreshToken,
	verifyRefreshToken,
} from '../utils/jwt.js';
import { verifyAccessTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js';
const authRoute = express.Router();

authRoute.post('/login', async (req, res) => {
	try {
		const { user } = req.body;

		if (!user) {
			return res.status(400).json({ message: 'User details not found' });
		}

		const parseUser = UserLogin.safeParse(user);
		if (!parseUser.success) {
			return res
				.status(422)
				.json({ message: 'Invalid format for user details' });
		}

		const { email, password } = parseUser.data;

		const userFound = await findUser(email);

		if (!userFound) {
			return res
				.status(401)
				.json({ message: 'Invalid email or password' });
		}

		const isMatch = await bcrypt.compare(password, userFound.password);
		if (!isMatch) {
			return res
				.status(401)
				.json({ message: 'Invalid email or password' });
		}

		const accessToken = createAccessToken(userFound.id);
		const refreshToken = createRefreshToken(userFound.id);

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 14 * 24 * 60 * 60 * 1000,
		})
			.status(200)
			.json({
				message: 'User fetched successful',
				accessToken,
				user: {
					id: userFound.id,
					email: userFound.email,
					username: userFound.username,
					name: userFound.name,
				},
			});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Something went wrong', error });
	}
});

authRoute.post('/signup', async (req, res) => {
	try {
		const { user } = req.body;

		if (!user) {
			return res.status(400).json({ message: 'User details not found' });
		}

		const parsedUser = UserSignUp.safeParse(user);
		if (!parsedUser.success) {
			return res
				.status(422)
				.json({ message: 'Invalid format for user details' });
		}

		const { username, name, email, password } = parsedUser.data;

		const existingByEmail = await findUser(email);
		const existingByUsername = await findUser(undefined, username);

		if (existingByEmail || existingByUsername) {
			return res.status(409).json({ message: 'User already registered' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await createUser(username, name, email, hashedPassword);

		res.status(201).json({
			message: 'User created successfully',
			user: { id: newUser.id, email: newUser.email },
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Signup failed', error });
	}
});

authRoute.get('/me', verifyAccessTokenMiddleware, async (req, res) => {
	try {
		const userId = req.userId;

		if (!userId) {
			return res.status(401).json({ message: 'Unauthorized access' });
		}

		const userFound = await getUserById(userId);

		if (!userFound) {
			return res.status(404).json({ message: 'User not found' });
		}

		res.status(200).json({
			message: 'User found',
			user: {
				id: userFound.id,
				email: userFound.email,
				username: userFound.username,
				name: userFound.name,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error', error });
	}
});

authRoute.get('/refresh', (req, res) => {
	try {
		const token = req.cookies.refreshToken;

		if (!token) {
			return res.status(401).json({ message: 'Refresh token missing' });
		}

		const payload = verifyRefreshToken(token) as { id: string };
		if (!payload || !payload.id) {
			return res.status(403).json({ message: 'Invalid refresh token' });
		}

		const newAccessToken = createAccessToken(payload.id);

		return res.status(200).json({
			message: 'Token refreshed',
			accessToken: newAccessToken,
		});
	} catch (error) {
		return res
			.status(401)
			.json({ message: 'Invalid or expired refresh token' });
	}
});

authRoute.post('/logout', (req, res) => {
	res.clearCookie('refreshToken', {
		httpOnly: true,
		sameSite: 'strict',
		secure: process.env.NODE_ENV === 'production',
	});
	res.status(200).json({ message: 'User logged out successfully' });
});
