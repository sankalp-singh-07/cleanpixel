import { Request, Response } from 'express';
import { ApplyBackgroundSchema } from '../types/backgroundTypes';
import { applyBackgroundService } from '../lib/backgroundService';
import { validateId } from '../utils/validateId';

export const applyBackgroundController = async (
	req: Request,
	res: Response
) => {
	try {
		const userId = req.userId;
		const { id } = req.params;

		if (!userId) {
			return res
				.status(401)
				.json({ success: false, message: 'No user found' });
		}
		if (!validateId(userId) || !validateId(id)) {
			return res
				.status(400)
				.json({ success: false, message: 'Wrong id' });
		}

		const parsed = ApplyBackgroundSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({
				success: false,
				message: 'Invalid data',
				errors: parsed.error,
			});
		}

		const { mode, backgroundId, prompt } = parsed.data;

		const result = await applyBackgroundService({
			imageId: id,
			userId,
			mode,
			backgroundId,
			prompt,
		});

		return res.status(200).json({
			success: true,
			message:
				mode === 'preset'
					? 'Background applied successfully (no credits used)'
					: 'AI background generated & applied successfully (1 credit used)',
			data: result,
		});
	} catch (err: any) {
		const msg = err?.message || 'Server error';

		if (msg === 'Image not found') {
			return res.status(404).json({ success: false, message: msg });
		}
		if (msg === 'Unauthorized user') {
			return res.status(403).json({ success: false, message: msg });
		}
		if (msg === 'This image has no removed background yet') {
			return res.status(400).json({ success: false, message: msg });
		}
		if (msg === 'Insufficient credits') {
			return res.status(402).json({ success: false, message: msg });
		}

		return res.status(500).json({
			success: false,
			message: 'Failed to apply background',
			error: msg,
		});
	}
};
