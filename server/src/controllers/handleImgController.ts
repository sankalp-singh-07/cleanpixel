import { Request, Response } from 'express';
import { cloudinary } from '../utils/keys';
import {
	checkCredits,
	deductCredit,
	fetchGallery,
	fetchOgImg,
	updateRemovedBgImg,
	userImageUpload,
} from '../lib/prisma';
import { removeImg } from '../utils/removeImg';
import fs from 'node:fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import { validateId } from '../utils/validateId';

export const uploadImageController = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;

		if (!userId) {
			return res.status(400).json({ message: 'No user found' });
		}

		if (!validateId(userId))
			return res.status(400).json({ message: 'Wrong id' });

		if (!req.file) {
			return res.status(400).json({ message: 'No file found' });
		}

		const img = await cloudinary.uploader.upload(req.file.path);

		const imgDb = await userImageUpload(img.secure_url, userId);

		res.status(200).json({
			message: 'Image uploaded successfully',
			imageUrl: img.secure_url,
			imageId: imgDb.id,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Upload failed', error });
	}
};

export const removeImageController = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const userId = req.userId;

		if (!userId) {
			return res.status(400).json({ message: 'No user found' });
		}

		if (!validateId(userId) || !validateId(id))
			return res.status(400).json({ message: 'Wrong id' });

		const credits = await checkCredits(userId);

		if (!credits)
			return res.status(402).json({ message: 'Insufficient credits' });

		const imgUrl = await fetchOgImg(id);

		if (!imgUrl) {
			return res.status(400).json({ message: 'No image found' });
		}

		const imgBuffer = await removeImg(imgUrl);

		const tmpDir = os.tmpdir();
		const fileName = `${uuidv4()}.png`;
		const filePath = path.join(tmpDir, fileName);

		fs.writeFileSync(filePath, Buffer.from(imgBuffer));

		const img = await cloudinary.uploader.upload(filePath, {
			resource_type: 'image',
			format: 'png',
		} as any);

		fs.unlinkSync(filePath);

		const imgDb = await updateRemovedBgImg(img.secure_url, id, userId);

		await deductCredit(userId);

		const remaining = await checkCredits(userId);

		return res.status(200).json({
			message: 'No Bg Image created and uploaded successfully',
			imageUrl: img.secure_url,
			imageId: imgDb.id,
			credits: remaining,
		});
	} catch (error: any) {
		console.error('Error removing background:', error);

		let status = 500;
		let message = 'Background removal failed';

		if (error.message?.includes('quota exceeded')) status = 402;
		if (error.message?.includes('Too many requests')) status = 429;

		return res.status(status).json({
			message,
			error: error.message,
		});
	}
};

export const galleryController = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		if (!userId) {
			return res.status(400).json({ message: 'No user found' });
		}

		if (!validateId(userId))
			return res.status(400).json({ message: 'Wrong id' });

		const show = (req.query.show as string) || 'all';
		const sort = (req.query.sort as string) === 'asc' ? 'asc' : 'desc';
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;
		const skip = (page - 1) * limit;

		const gallery = await fetchGallery(userId, show, sort, limit, skip);

		res.status(200).json({
			message: 'Gallery fetched successfully',
			gallery,
			page,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Failed to get images', error });
	}
};
