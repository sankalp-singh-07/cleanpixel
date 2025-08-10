import express, { Request, Response } from 'express';
import { verifyAccessTokenMiddleware } from '../middlewares/verifyTokenMiddleware';
import { validateId } from '../utils/validateId';
import { getCredits } from '../lib/prisma';

const paymentRoute = express.Router();

paymentRoute.get(
	'/credits',
	verifyAccessTokenMiddleware,
	async (req: Request, res: Response) => {
		try {
			const userId = req.userId;

			if (!userId) {
				return res.status(400).json({ message: 'No user found' });
			}

			if (!validateId(userId))
				return res.status(400).json({ message: 'Wrong id' });

			const credits = await getCredits(userId);

			if (credits === null || credits === undefined) {
				return res
					.status(500)
					.json({ message: 'Failed to get credits count' });
			}

			res.status(200).json({
				message: 'Credits fetched successfully',
				credits,
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Failed to get credits', error });
		}
	}
);

export default paymentRoute;
