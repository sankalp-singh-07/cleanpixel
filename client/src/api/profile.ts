import api from '@/api';
import type {
	ProfileResponse,
	PublicProfileResponse,
	UpdateProfilePayload,
	UpdateProfileResponse,
	UserProfile,
} from '@/types/profileTypes';

export async function getProfile(): Promise<UserProfile> {
	const { data } = await api.get<ProfileResponse>('/profile');
	return data.data;
}

export async function getPublicProfile(username: string) {
	const { data } = await api.get<PublicProfileResponse>(`/users/${username}`);
	return data.data;
}

export async function updateProfile(payload: UpdateProfilePayload) {
	const { data } = await api.patch<UpdateProfileResponse>('/updateProfile', payload);
	return data.data;
}

export async function uploadAvatar(file: File) {
	const formData = new FormData();
	formData.append('avatar', file);

	const { data } = await api.patch<UpdateProfileResponse>(
		'/profile/avatar',
		formData
	);
	return data.data;
}

export async function toggleImageVisibility(imageId: string) {
	const { data } = await api.patch<{
		success: boolean;
		message: string;
		data: {
			id: string;
			isPublic: boolean;
		};
	}>(`/images/${imageId}/visibility`);
	return data.data;
}
