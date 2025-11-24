import { z } from 'zod';

export const FolderCreateSchema = z.object({
	name: z
		.string()
		.min(1, 'Folder name is required')
		.max(100, 'Name too long'),
	description: z
		.string()
		.max(200, 'Max length for description is 200')
		.optional(),
	isPublic: z.boolean().optional().default(false),
	thumbnailUrl: z.url().optional(),
});

export const FolderUpdateSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	description: z.string().max(200).nullable().optional(),
	isPublic: z.boolean().optional(),
	thumbnailUrl: z.url().nullable().optional(),
});

export const AssignImageSchema = z.object({
	imageId: z.cuid('Invalid image id'),
	folderId: z.cuid('Invalid folder id'),
});

export const PaginationSchema = z.object({
	page: z
		.string()
		.transform((val) => parseInt(val || '1'))
		.optional(),
	limit: z
		.string()
		.transform((val) => parseInt(val || '24'))
		.optional(),
});

export type FolderCreate = z.infer<typeof FolderCreateSchema>;
export type FolderUpdate = z.infer<typeof FolderUpdateSchema>;
export type AssignImage = z.infer<typeof AssignImageSchema>;
