import api from '@/api';
import type {
	FolderListResponse,
	FolderResponse,
	PublicFolderResponse,
	CreateFolderPayload,
	UpdateFolderPayload,
	AssignImagePayload,
	Folder,
	FolderImage,
} from '@/types/folderTypes';

export async function getFolders(): Promise<Folder[]> {
	const { data } = await api.get<FolderListResponse>('/folders');
	return data.data;
}

export async function getFolder(folderId: string) {
	const { data } = await api.get<FolderResponse>(`/folders/${folderId}`);
	return data.data;
}

export async function createFolder(payload: CreateFolderPayload): Promise<Folder> {
	const { data } = await api.post<{ success: boolean; data: Folder }>('/folders', payload);
	return data.data;
}

export async function updateFolder(
	folderId: string,
	payload: UpdateFolderPayload
): Promise<Folder> {
	const { data } = await api.patch<{ success: boolean; data: Folder }>(
		`/folders/${folderId}`,
		payload
	);
	return data.data;
}

export async function deleteFolder(folderId: string): Promise<void> {
	await api.delete(`/folders/${folderId}`);
}

export async function assignImageToFolder(payload: AssignImagePayload): Promise<FolderImage> {
	const { data } = await api.post<{ success: boolean; data: FolderImage }>(
		'/folders/assign-image',
		payload
	);
	return data.data;
}

export async function removeImageFromFolder(imageId: string): Promise<FolderImage> {
	const { data } = await api.patch<{ success: boolean; data: FolderImage }>(
		`/folders/remove-image/${imageId}`
	);
	return data.data;
}

export async function getPublicFolder(
	username: string,
	folderId: string,
	page = 1,
	limit = 24
) {
	const { data } = await api.get<PublicFolderResponse>(
		`/profile/${username}/folder/${folderId}`,
		{ params: { page, limit } }
	);
	return data.data;
}
