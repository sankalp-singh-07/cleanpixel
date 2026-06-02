import { Request, Response } from 'express';
import {
	FolderCreateSchema,
	FolderUpdateSchema,
	AssignImageSchema,
	PaginationSchema,
} from '../types/folderTypes';
import * as folderService from '../lib/prisma';
import { validateId } from '../utils/validateId';
import { logger } from '../utils/logger';

export const createFolderController = async (req: Request, res: Response) => {
	const startTime = Date.now();
	logger.logRequest(req, 'Creating new folder');
	
	try {
		const userId = req.userId;
		if (!userId) {
			logger.warn('Unauthorized folder creation attempt', { endpoint: '/folders', method: 'POST' });
			return res
				.status(401)
				.json({ success: false, message: 'Unauthorized' });
		}

		const parsed = FolderCreateSchema.safeParse(req.body);
		if (!parsed.success) {
			logger.warn('Invalid folder creation data', { 
				userId, 
				errors: parsed.error.flatten(),
				body: req.body 
			});
			return res
				.status(400)
				.json({ success: false, errors: parsed.error });
		}

		logger.info('Creating folder in database', { userId, folderData: parsed.data });
		const folder = await folderService.createFolder(userId, parsed.data);
		
		logger.logDatabaseOperation('CREATE', 'folder', true, { 
			userId, 
			folderId: folder.id,
			folderName: folder.name 
		});
		
		const duration = Date.now() - startTime;
		logger.info('Folder created successfully', { 
			userId, 
			folderId: folder.id, 
			duration 
		});
		
		return res.status(201).json({ success: true, data: folder });
	} catch (err) {
		const duration = Date.now() - startTime;
		logger.logError(err as Error, req, { 
			operation: 'createFolder',
			duration,
			userId: req.userId 
		});
		
		const message = err instanceof Error ? err.message : 'Server error';
		if (message === 'Not authorized') {
			return res.status(403).json({ success: false, message });
		}
		return res.status(500).json({ success: false, message });
	}
};

export const listUserFoldersController = async (
	req: Request,
	res: Response
) => {
	try {
		const userId = req.userId;
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

export const getFolderController = async (req: Request, res: Response) => {
	const startTime = Date.now();
	logger.logRequest(req, 'Fetching folder details');
	
	try {
		const userId = req.userId;
		const { folderId } = req.params;
		
		if (!userId) {
			logger.warn('Unauthorized folder access attempt', { 
				folderId, 
				endpoint: `/folders/${folderId}` 
			});
			return res
				.status(401)
				.json({ success: false, message: 'Unauthorized' });
		}

		if (!folderId || !validateId(folderId)) {
			logger.warn('Invalid folder ID provided', { 
				userId, 
				folderId, 
				isValid: validateId(folderId || '') 
			});
			return res
				.status(400)
				.json({ success: false, message: 'Invalid folder ID' });
		}

		logger.info('Fetching folder from database', { userId, folderId });
		const folder = await folderService.getFolderWithImages(folderId, userId);
		
		logger.logDatabaseOperation('READ', 'folder', true, { 
			userId, 
			folderId,
			imageCount: folder._count?.images || 0
		});
		
		const duration = Date.now() - startTime;
		logger.info('Folder fetched successfully', { 
			userId, 
			folderId, 
			imageCount: folder._count?.images || 0,
			duration 
		});
		
		return res.status(200).json({ success: true, data: folder });
	} catch (err) {
		const duration = Date.now() - startTime;
		logger.logError(err as Error, req, { 
			operation: 'getFolder',
			folderId: req.params.folderId,
			duration,
			userId: req.userId 
		});
		
		const message = err instanceof Error ? err.message : 'Server error';
		if (message === 'Folder not found') {
			logger.warn('Folder not found', { 
				userId: req.userId, 
				folderId: req.params.folderId 
			});
			return res.status(404).json({ success: false, message });
		}
		if (message === 'Not authorized') {
			logger.warn('Unauthorized folder access', { 
				userId: req.userId, 
				folderId: req.params.folderId 
			});
			return res.status(403).json({ success: false, message });
		}
		return res.status(500).json({ success: false, message });
	}
};

export const updateFolderController = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		const { folderId } = req.params;
		if (!userId)
			return res
				.status(401)
				.json({ success: false, message: 'Unauthorized' });

		if (!folderId || !validateId(folderId))
			return res
				.status(400)
				.json({ success: false, message: 'Invalid folder ID' });

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
		const userId = req.userId;
		const { folderId } = req.params;
		if (!userId)
			return res
				.status(401)
				.json({ success: false, message: 'Unauthorized' });

		if (!folderId || !validateId(folderId))
			return res
				.status(400)
				.json({ success: false, message: 'Invalid folder ID' });

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

		if (!validateId(folderId))
			return res
				.status(400)
				.json({ success: false, message: 'Invalid folder ID' });

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
	const startTime = Date.now();
	logger.logRequest(req, 'Assigning image to folder');
	
	try {
		const userId = req.userId;
		if (!userId) {
			logger.warn('Unauthorized image assignment attempt', { 
				endpoint: '/folders/assign-image' 
			});
			return res
				.status(401)
				.json({ success: false, message: 'Unauthorized' });
		}

		const parsed = AssignImageSchema.safeParse(req.body);
		if (!parsed.success) {
			logger.warn('Invalid image assignment data', { 
				userId, 
				errors: parsed.error.flatten(),
				body: req.body 
			});
			return res
				.status(400)
				.json({ success: false, errors: parsed.error });
		}

		const { imageId, folderId } = parsed.data;
		logger.info('Assigning image to folder in database', { 
			userId, 
			imageId, 
			folderId 
		});
		
		const updated = await folderService.assignImageToFolder(
			imageId,
			folderId,
			userId
		);
		
		logger.logDatabaseOperation('UPDATE', 'image_folder_assignment', true, { 
			userId, 
			imageId,
			folderId,
			updatedImageId: updated.id
		});
		
		const duration = Date.now() - startTime;
		logger.info('Image assigned to folder successfully', { 
			userId, 
			imageId, 
			folderId,
			duration 
		});
		
		return res.status(200).json({ success: true, data: updated });
	} catch (err) {
		const duration = Date.now() - startTime;
		logger.logError(err as Error, req, { 
			operation: 'assignImage',
			imageId: req.body?.imageId,
			folderId: req.body?.folderId,
			duration,
			userId: req.userId 
		});
		
		const message = err instanceof Error ? err.message : 'Server error';
		if (message === 'Image not found' || message === 'Folder not found') {
			logger.warn('Resource not found during assignment', { 
				userId: req.userId, 
				imageId: req.body?.imageId,
				folderId: req.body?.folderId,
				error: message
			});
			return res.status(404).json({ success: false, message });
		}
		if (
			message === 'Not authorized' ||
			message === 'Folder does not belong to user'
		) {
			logger.warn('Unauthorized assignment attempt', { 
				userId: req.userId, 
				imageId: req.body?.imageId,
				folderId: req.body?.folderId,
				error: message
			});
			return res.status(403).json({ success: false, message });
		}
		return res.status(500).json({ success: false, message });
	}
};

export const removeImageController = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		if (!userId)
			return res
				.status(401)
				.json({ success: false, message: 'Unauthorized' });

		const { imageId } = req.params;
		if (!imageId || !validateId(imageId))
			return res
				.status(400)
				.json({ success: false, message: 'Invalid image ID' });

		const updated = await folderService.removeImageFromFolder(
			imageId,
			userId
		);
		return res.status(200).json({ success: true, data: updated });
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Server error';
		if (message === 'Image not found')
			return res.status(404).json({ success: false, message });
		if (message === 'Not authorized')
			return res.status(403).json({ success: false, message });
		return res.status(500).json({ success: false, message });
	}
};
