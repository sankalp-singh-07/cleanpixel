import { PrismaClient } from '@prisma/client';
import { composeSubjectOnBackground } from '../utils/composeBackgrounds';
import { generateBackgroundImage } from '../utils/generateBackground';
import { getBackgroundById } from '../utils/backgrounds';
import { checkCredits, deductCredit } from '../lib/prisma';
import { cloudinary } from '../utils/keys';

const client = new PrismaClient();

export const applyBackgroundService = async (params: {
	imageId: string;
	userId: string;
	mode: 'preset' | 'generate';
	backgroundId?: string;
	prompt?: string;
}) => {
	const { imageId, userId, mode, backgroundId, prompt } = params;

	const image = await client.userImage.findUnique({ where: { id: imageId } });
	if (!image) throw new Error('Image not found');
	if (image.userId !== userId) throw new Error('Unauthorized user');

	if (!image.removedBgUrl) {
		throw new Error('This image has no removed background yet');
	}

	let backgroundUrl: string;
	let shouldDeductCredit = false;

	if (mode === 'preset') {
		if (!backgroundId)
			throw new Error('backgroundId is required for preset mode');
		const bg = getBackgroundById(backgroundId);
		if (!bg) throw new Error('Background not found');
		backgroundUrl = bg.imageUrl;
		shouldDeductCredit = false;
	} else {
		if (!prompt) throw new Error('prompt is required for generate mode');

		const hasCredits = await checkCredits(userId);
		if (!hasCredits) throw new Error('Insufficient credits');

		backgroundUrl = await generateBackgroundImage(prompt);
		shouldDeductCredit = true;
	}

	const composedBuffer = await composeSubjectOnBackground(
		image.removedBgUrl,
		backgroundUrl
	);

	const uploadResult = await cloudinary.uploader.upload(
		`data:image/png;base64,${composedBuffer.toString('base64')}`,
		{
			resource_type: 'image',
			format: 'png',
		} as any
	);

	const updated = await client.userImage.update({
		where: { id: imageId },
		data: {
			replacedUrl: uploadResult.secure_url,
			type: mode === 'preset' ? 'preset-bg' : 'ai-bg',
		},
	});

	if (shouldDeductCredit) {
		await deductCredit(userId);
	}

	return {
		image: updated,
		finalUrl: uploadResult.secure_url,
		creditsDeducted: shouldDeductCredit ? 1 : 0,
	};
};
