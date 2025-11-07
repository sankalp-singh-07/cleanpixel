import { create } from 'zustand';
import { getGallery } from '@/api/image';
import type { ImageItem } from '@/types/uploadTypes';

type GalleryStore = {
	images: ImageItem[];
	loading: boolean;
	error: string | null;
	show: 'all' | 'original' | 'removed';
	sort: 'asc' | 'desc';
	page: number;
	limit: number;
	total: number;
	hasMore: boolean;
	fetchGallery: (
		params?: Partial<{
			show: string;
			sort: string;
			page: number;
			limit: number;
		}>
	) => Promise<void>;
};

export const useGalleryStore = create<GalleryStore>((set, get) => ({
	images: [],
	loading: false,
	error: null,
	show: 'all',
	sort: 'desc',
	page: 1,
	limit: 8,
	total: 0,
	hasMore: true,

	fetchGallery: async (params) => {
		const state = get();
		const query = {
			show: params?.show || state.show,
			sort: params?.sort || state.sort,
			page: params?.page ?? state.page,
			limit: params?.limit ?? state.limit,
		};

		set({ loading: true, error: null });

		try {
			const { gallery, page: currentPage } = await getGallery(
				query.show as any,
				query.sort as any,
				query.page,
				query.limit
			);

			const hasMore = gallery.length === query.limit;
			set({
				images: gallery,
				show: query.show as any,
				sort: query.sort as any,
				page: currentPage,
				limit: query.limit,
				hasMore,
			});
		} catch (err: any) {
			set({ error: err.message });
		} finally {
			set({ loading: false });
		}
	},
}));
