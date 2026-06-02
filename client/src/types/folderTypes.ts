export type Folder = {
	id: string;
	userId: string;
	name: string;
	description: string | null;
	isPublic: boolean;
	thumbnailUrl: string | null;
	createdAt: string;
	updatedAt: string;
};

export type FolderWithImages = Folder & {
	images: FolderImage[];
	_count: { images: number };
};

export type FolderImage = {
	id: string;
	userId: string;
	folderId: string | null;
	originalUrl: string;
	removedBgUrl: string | null;
	replacedUrl: string | null;
	isPublic: boolean;
	type: string | null;
	createdAt: string;
};

export type CreateFolderPayload = {
	name: string;
	description?: string;
	isPublic?: boolean;
};

export type UpdateFolderPayload = {
	name?: string;
	description?: string | null;
	isPublic?: boolean;
	thumbnailUrl?: string | null;
};

export type FolderListResponse = {
	success: boolean;
	data: Folder[];
};

export type FolderResponse = {
	success: boolean;
	data: FolderWithImages;
};

export type PublicFolderResponse = {
	success: boolean;
	data: {
		folder: Folder;
		owner: { username: string; name: string; avatarUrl: string | null };
		images: FolderImage[];
		pagination: {
			page: number;
			limit: number;
			total: number;
			pages: number;
		};
	};
};

export type AssignImagePayload = {
	imageId: string;
	folderId: string;
};
