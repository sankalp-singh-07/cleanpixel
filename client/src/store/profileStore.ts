import { create } from 'zustand';
import * as profileApi from '@/api/profile';
import type { UserProfile, UpdateProfilePayload } from '@/types/profileTypes';

type ProfileStore = {
	profile: UserProfile | null;
	loading: boolean;
	error: string | null;
	updating: boolean;

	// Actions
	fetchProfile: () => Promise<void>;
	updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
	uploadAvatar: (file: File) => Promise<void>;
	toggleImageVisibility: (imageId: string) => Promise<void>;
	clearProfile: () => void;
	clearError: () => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
	profile: null,
	loading: false,
	error: null,
	updating: false,

	fetchProfile: async () => {
		set({ loading: true, error: null });
		try {
			const profile = await profileApi.getProfile();
			set({ profile, loading: false });
		} catch (err: any) {
			set({ error: err.response?.data?.message || err.message, loading: false });
		}
	},

	updateProfile: async (payload: UpdateProfilePayload) => {
		set({ updating: true, error: null });
		try {
			const updated = await profileApi.updateProfile(payload);
			set((state) => ({
				profile: state.profile
					? {
							...state.profile,
							name: updated.name,
							bio: updated.bio,
							avatarUrl: updated.avatarUrl,
							publicProfile: updated.publicProfile,
					  }
					: null,
				updating: false,
			}));
		} catch (err: any) {
			set({ error: err.response?.data?.message || err.message, updating: false });
			throw err;
		}
	},

	uploadAvatar: async (file: File) => {
		set({ updating: true, error: null });
		try {
			const updated = await profileApi.uploadAvatar(file);
			set((state) => ({
				profile: state.profile
					? {
							...state.profile,
							avatarUrl: updated.avatarUrl,
					  }
					: null,
				updating: false,
			}));
		} catch (err: any) {
			set({ error: err.response?.data?.message || err.message, updating: false });
			throw err;
		}
	},

	toggleImageVisibility: async (imageId: string) => {
		try {
			const result = await profileApi.toggleImageVisibility(imageId);
			set((state) => ({
				profile: state.profile
					? {
							...state.profile,
							images: state.profile.images.map((img) =>
								img.id === imageId ? { ...img, isPublic: result.isPublic } : img
							),
					  }
					: null,
			}));
		} catch (err: any) {
			set({ error: err.response?.data?.message || err.message });
			throw err;
		}
	},

	clearProfile: () => set({ profile: null }),
	clearError: () => set({ error: null }),
}));
