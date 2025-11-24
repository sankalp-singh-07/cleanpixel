import { Request, Response } from 'express';
import {
	FolderCreateSchema,
	FolderUpdateSchema,
	AssignImageSchema,
	PaginationSchema,
} from '../types/folderTypes';
import * as folderService from '../lib/prisma';

export const createFolderController = async (req: Request, res: Response) => {
	try {
		const userId = (req as any).userId as string;
		if (!userId)
			return res
				.status(401)
				.json({ success: false, message: 'Unauthorized' });

		const parsed = FolderCreateSchema.safeParse(req.body);
		if (!parsed.success) {
			return res
				.status(400)
				.json({ success: false, errors: parsed.error.flatten() });
		}

		const folder = await folderService.createFolder(userId, parsed.data);
		return res.status(201).json({ success: true, data: folder });
	} catch (err) {
		console.error('createFolderController:', err);
		const message = err instanceof Error ? err.message : 'Server error';
		if (message === 'Not authorized')
			return res.status(403).json({ success: false, message });
		return res.status(500).json({ success: false, message });
	}
};

export const listUserFoldersController = async (
	req: Request,
	res: Response
) => {
	try {
		const userId = (req as any).userId as string;
		if (!userId)
			return res
				.status(401)
				.json({ success: false, message: 'Unauthorized' });

		const folders = await folderService.listUserFolders(userId);
		return res.status(200).json({ success: true, data: folders });
	} catch (err) {
		console.error('listUserFoldersController:', err);
		return res
			.status(500)
			.json({ success: false, message: 'Server error' });
	}
};

export const updateFolderController = async (req: Request, res: Response) => {
	try {
		const userId = (req as any).userId as string;
		const { folderId } = req.params;
		if (!userId)
			return res
				.status(401)
				.json({ success: false, message: 'Unauthorized' });

		const parsed = FolderUpdateSchema.safeParse(req.body);
		if (!parsed.success)
			return res
				.status(400)
				.json({ success: false, errors: parsed.error.flatten() });

		const updated = await folderService.updateFolder(
			folderId,
			userId,
			parsed.data
		);
		return res.status(200).json({ success: true, data: updated });
	} catch (err) {
		console.error('updateFolderController:', err);
		const message = err instanceof Error ? err.message : 'Server error';
		if (message === 'Folder not found')
			return res.status(404).json({ success: false, message });
		if (message === 'Not authorized')
			return res.status(403).json({ success: false, message });
		return res.status(500).json({ success: false, message });
	}
};

export const deleteFolderController = async (req: Request, res: Response) => {
	try {
		const userId = (req as any).userId as string;
		const { folderId } = req.params;
		if (!userId)
			return res
				.status(401)
				.json({ success: false, message: 'Unauthorized' });

		const deleted = await folderService.deleteFolder(folderId, userId);
		return res.status(200).json({ success: true, data: deleted });
	} catch (err) {
		console.error('deleteFolderController:', err);
		const message = err instanceof Error ? err.message : 'Server error';
		if (message === 'Folder not found')
			return res.status(404).json({ success: false, message });
		if (message === 'Not authorized')
			return res.status(403).json({ success: false, message });
		return res.status(500).json({ success: false, message });
	}
};

export const getPublicFolderController = async (
	req: Request,
	res: Response
) => {
	try {
		const { username, folderId } = req.params;

		const parsed = PaginationSchema.safeParse({
			page: req.query.page as string,
			limit: req.query.limit as string,
		});
		const page = parsed.success ? parsed.data.page ?? 1 : 1;
		const limit = parsed.success ? parsed.data.limit ?? 24 : 24;

		if (!username || !folderId)
			return res
				.status(400)
				.json({ success: false, message: 'Missing params' });

		const data = await folderService.getPublicFolderByUsername(
			username,
			folderId,
			page,
			limit
		);
		return res.status(200).json({ success: true, data });
	} catch (err) {
		console.error('getPublicFolderController:', err);
		const message = err instanceof Error ? err.message : 'Server error';
		if (message === 'User not found' || message === 'Folder not found')
			return res.status(404).json({ success: false, message });
		if (
			message === 'Profile is private' ||
			message === 'Folder is private' ||
			message === 'Folder does not belong to user'
		)
			return res.status(403).json({ success: false, message });
		return res.status(500).json({ success: false, message });
	}
};

export const assignImageController = async (req: Request, res: Response) => {
	try {
		const userId = (req as any).userId as string;
		if (!userId)
			return res
				.status(401)
				.json({ success: false, message: 'Unauthorized' });

		const parsed = AssignImageSchema.safeParse(req.body);
		if (!parsed.success)
			return res
				.status(400)
				.json({ success: false, errors: parsed.error.flatten() });

		const updated = await folderService.assignImageToFolder(
			parsed.data.imageId,
			parsed.data.folderId,
			userId
		);
		return res.status(200).json({ success: true, data: updated });
	} catch (err) {
		console.error('assignImageController:', err);
		const message = err instanceof Error ? err.message : 'Server error';
		if (message === 'Image not found' || message === 'Folder not found')
			return res.status(404).json({ success: false, message });
		if (
			message === 'Not authorized' ||
			message === 'Folder does not belong to user'
		)
			return res.status(403).json({ success: false, message });
		return res.status(500).json({ success: false, message });
	}
};

export const removeImageController = async (req: Request, res: Response) => {
	try {
		const userId = (req as any).userId as string;
		if (!userId)
			return res
				.status(401)
				.json({ success: false, message: 'Unauthorized' });

		const { imageId } = req.params;
		if (!imageId)
			return res
				.status(400)
				.json({ success: false, message: 'imageId required' });

		const updated = await folderService.removeImageFromFolder(
			imageId,
			userId
		);
		return res.status(200).json({ success: true, data: updated });
	} catch (err) {
		console.error('removeImageController:', err);
		const message = err instanceof Error ? err.message : 'Server error';
		if (message === 'Image not found')
			return res.status(404).json({ success: false, message });
		if (message === 'Not authorized')
			return res.status(403).json({ success: false, message });
		return res.status(500).json({ success: false, message });
	}
};
