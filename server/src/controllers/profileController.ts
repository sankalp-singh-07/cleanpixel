import { Request, Response } from 'express';
import {
	fetchPublicProfile,
	getUserProfile,
	updateUserProfile,
} from '../lib/prisma';

export const getPublicProfile = async (req: Request, res: Response) => {
	try {
		const { username } = req.params;
		if (!username)
			return res
				.status(400)
				.json({ success: false, message: 'Username not provided' });

		const userData = await fetchPublicProfile(username);
		return res.status(200).json({
			success: true,
			message: 'Profile fetched successfully',
			data: userData,
		});
	} catch (err) {
		const error = err as Error;
		if (error.message === 'User not found')
			return res
				.status(404)
				.json({ success: false, message: error.message });
		if (error.message === 'Profile is private')
			return res
				.status(403)
				.json({ success: false, message: error.message });
		return res
			.status(500)
			.json({ success: false, message: 'Internal Server Error' });
	}
};

export const getProfile = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		if (!userId)
			return res
				.status(401)
				.json({ success: false, message: 'Unauthorized' });

		const profile = await getUserProfile(userId);
		if (!profile)
			return res
				.status(404)
				.json({ success: false, message: 'Profile not found' });

		return res.status(200).json({ success: true, data: profile });
	} catch (err) {
		console.error('getProfile:', err);
		return res
			.status(500)
			.json({ success: false, message: 'Internal Server Error' });
	}
};

export const updateProfile = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		if (!userId)
			return res
				.status(401)
				.json({ success: false, message: 'Unauthorized' });

		const { name, bio, avatarUrl, publicProfile } = req.body;

		if (name && typeof name !== 'string')
			return res
				.status(400)
				.json({ success: false, message: 'Invalid name' });
		if (bio && typeof bio !== 'string')
			return res
				.status(400)
				.json({ success: false, message: 'Invalid bio' });
		if (avatarUrl && typeof avatarUrl !== 'string')
			return res
				.status(400)
				.json({ success: false, message: 'Invalid avatarUrl' });
		if (publicProfile !== undefined && typeof publicProfile !== 'boolean')
			return res
				.status(400)
				.json({ success: false, message: 'Invalid publicProfile' });

		const updatedUser = await updateUserProfile(userId, {
			name,
			bio,
			avatarUrl,
			publicProfile,
		});

		return res.status(200).json({ success: true, data: updatedUser });
	} catch (err) {
		console.error('updateProfile:', err);
		return res
			.status(500)
			.json({ success: false, message: 'Internal Server Error' });
	}
};
