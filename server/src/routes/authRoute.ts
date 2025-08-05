import express from 'express';
import { UserLogin, UserSignUp } from '../types/userType.js';
import bcrypt from 'bcrypt';
import { createUser, findUser } from '../lib/prisma.js';
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

		res.status(200).json({
			message: 'User fetched successful',
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

		const existingUser = await findUser(email);
		if (existingUser) {
			return res
				.status(409)
				.json({ message: 'Email already registered' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await createUser(username, name, email, hashedPassword);

		res.status(201).json({
			message: 'User created successfully',
			user: newUser,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Signup failed', error });
	}
});

export default authRoute;
