import express from 'express';
import { UserSignUp } from '../types/userType.js';
import bcrypt from 'bcrypt';
const authRoute = express.Router();

authRoute.post('/login', (req, res) => {
	const { user } = req.body;

	if (!user) {
		return res.status(404).json({
			message: 'User Details Not found',
		});
	}
	const { email, password } = user;

	res.send('Login here');
});

authRoute.post('/signup', async (req, res) => {
	try {
		const { user } = req.body;

		if (!user) {
			return res.status(404).json({
				message: 'User details not found',
			});
		}

		const parsedUser = UserSignUp.safeParse(user);

		if (!parsedUser.success) {
			return res.status(406).json({
				message: 'Not valid format user details',
			});
		}

		const { username, name, email, password } = user;

		if (!username || !name || !email || !password)
			return res.status(404).json({
				message: 'Missing details',
			});

		const hashedPassword = await bcrypt.hash(password, 7);

		res.send('signup here');
	} catch (error) {
		res.status(400).json({
			message: error,
		});
	}
});

export default authRoute;
