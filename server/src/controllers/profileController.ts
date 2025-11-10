import { Request, Response } from 'express';
import { fetchProfile } from '../lib/prisma';

export const profile = async (req: Request, res: Response) => {
	try {
		const { username } = req.body;

		if (!username) {
			return res.status(400).json({ message: 'Username not provided' });
		}

		const userData = await fetchProfile(username);

		return res.status(200).json({
			message: 'Profile fetched successfully',
			success: true,
			data: userData,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};
