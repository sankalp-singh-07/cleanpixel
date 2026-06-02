import { Request, Response } from 'express';
import { ApplyBackgroundSchema } from '../types/backgroundTypes';
import { applyBackgroundService } from '../lib/backgroundService';
import { validateId } from '../utils/validateId';
import { PREDEFINED_BACKGROUNDS } from '../utils/backgrounds';
import { logger } from '../utils/logger';

export const listBackgroundsController = async (
	_req: Request,
	res: Response
) => {
	const startTime = Date.now();
	logger.logRequest(_req, 'Fetching background presets');
	
	try {
		logger.info('Processing predefined backgrounds', { 
			totalBackgrounds: PREDEFINED_BACKGROUNDS.length 
		});
		
		const backgrounds = PREDEFINED_BACKGROUNDS.map(
			({ id, label, category, imageUrl }) => ({
				id,
				label,
				category,
				preview: imageUrl,
			})
		);
		
		const duration = Date.now() - startTime;
		logger.info('Background presets fetched successfully', { 
			backgroundCount: backgrounds.length,
			categories: [...new Set(backgrounds.map(bg => bg.category))],
			duration 
		});
		
		return res.status(200).json({ success: true, data: backgrounds });
	} catch (err) {
		const duration = Date.now() - startTime;
		logger.logError(err as Error, _req, { 
			operation: 'listBackgrounds',
			duration,
			backgroundsAvailable: PREDEFINED_BACKGROUNDS.length
		});
		
		return res
			.status(500)
			.json({ success: false, message: 'Failed to fetch backgrounds' });
	}
};

export const applyBackgroundController = async (
	req: Request,
	res: Response
) => {
	const startTime = Date.now();
	logger.logRequest(req, 'Applying background to image');
	
	try {
		const userId = req.userId;
		const { id } = req.params;

		if (!userId) {
			logger.warn('Unauthorized background application attempt', { 
				imageId: id,
				endpoint: `/images/${id}/background` 
			});
			return res
				.status(401)
				.json({ success: false, message: 'No user found' });
		}
		
		if (!validateId(userId) || !validateId(id)) {
			logger.warn('Invalid ID provided for background application', { 
				userId, 
				imageId: id,
				userIdValid: validateId(userId),
				imageIdValid: validateId(id)
			});
			return res
				.status(400)
				.json({ success: false, message: 'Wrong id' });
		}

		const parsed = ApplyBackgroundSchema.safeParse(req.body);
		if (!parsed.success) {
			logger.warn('Invalid background application data', { 
				userId, 
				imageId: id,
				errors: parsed.error.flatten(),
				body: req.body 
			});
			return res.status(400).json({
				success: false,
				message: 'Invalid data',
				errors: parsed.error,
			});
		}

		const { mode, backgroundId, prompt } = parsed.data;
		
		logger.info('Applying background via service', { 
			userId, 
			imageId: id, 
			mode, 
			backgroundId,
			hasPrompt: !!prompt
		});

		const result = await applyBackgroundService({
			imageId: id,
			userId,
			mode,
			backgroundId,
			prompt,
		});

		const duration = Date.now() - startTime;
		logger.info('Background applied successfully', { 
			userId, 
			imageId: id, 
			mode,
			backgroundId,
			finalUrl: result.finalUrl,
			creditsUsed: result.creditsDeducted || 0,
			duration 
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
		const duration = Date.now() - startTime;
		logger.logError(err, req, { 
			operation: 'applyBackground',
			imageId: req.params.id,
			mode: req.body?.mode,
			backgroundId: req.body?.backgroundId,
			duration,
			userId: req.userId 
		});
		
		const msg = err?.message || 'Server error';

		if (msg === 'Image not found') {
			logger.warn('Image not found for background application', { 
				userId: req.userId, 
				imageId: req.params.id 
			});
			return res.status(404).json({ success: false, message: msg });
		}
		if (msg === 'Unauthorized user') {
			logger.warn('Unauthorized background application', { 
				userId: req.userId, 
				imageId: req.params.id 
			});
			return res.status(403).json({ success: false, message: msg });
		}
		if (msg === 'This image has no removed background yet') {
			logger.warn('Background application attempted on image without removed background', { 
				userId: req.userId, 
				imageId: req.params.id 
			});
			return res.status(400).json({ success: false, message: msg });
		}
		if (msg === 'Insufficient credits') {
			logger.warn('Insufficient credits for background application', { 
				userId: req.userId, 
				imageId: req.params.id,
				mode: req.body?.mode
			});
			return res.status(402).json({ success: false, message: msg });
		}

		return res.status(500).json({
			success: false,
			message: 'Failed to apply background',
			error: msg,
		});
	}
};
