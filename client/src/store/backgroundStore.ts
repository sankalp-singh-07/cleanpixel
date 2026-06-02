import { create } from 'zustand';
import * as backgroundApi from '@/api/background';
import type { PresetBackground, ApplyBackgroundPayload } from '@/types/backgroundTypes';
import { logger } from '@/utils/logger';

type BackgroundStore = {
	backgrounds: PresetBackground[];
	loading: boolean;
	applying: boolean;
	error: string | null;

	// Actions
	fetchBackgrounds: () => Promise<void>;
	applyBackground: (
		imageId: string,
		payload: ApplyBackgroundPayload
	) => Promise<{ finalUrl: string; creditsDeducted: number }>;
	clearError: () => void;
};

export const useBackgroundStore = create<BackgroundStore>((set, get) => ({
	backgrounds: [],
	loading: false,
	applying: false,
	error: null,

	fetchBackgrounds: async () => {
		const state = get();
		logger.logStoreAction('backgroundStore', 'fetchBackgrounds', true, { action: 'start' });
		
		// Don't fetch if already loading
		if (state.loading) {
			return;
		}
		
		set({ loading: true, error: null });
		try {
			const backgrounds = await backgroundApi.getBackgrounds();
			
			// Validate the data structure
			const validBackgrounds = backgrounds.filter(bg => 
				bg && bg.id && bg.label && bg.category && bg.preview
			);
			
			if (validBackgrounds.length !== backgrounds.length) {
				console.warn('⚠️ BackgroundStore: Some backgrounds have invalid data:', {
					total: backgrounds.length,
					valid: validBackgrounds.length,
					invalid: backgrounds.length - validBackgrounds.length
				});
			}
			
			set({ backgrounds: validBackgrounds, loading: false });
			
			logger.logStoreAction('backgroundStore', 'fetchBackgrounds', true, { 
				backgroundCount: validBackgrounds.length,
				categories: [...new Set(validBackgrounds.map(bg => bg.category))]
			});
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || err.message || 'Failed to load backgrounds';
			set({ error: errorMessage, loading: false });
			logger.logStoreAction('backgroundStore', 'fetchBackgrounds', false, { 
				error: errorMessage,
				statusCode: err.response?.status
			});
		}
	},

	applyBackground: async (imageId: string, payload: ApplyBackgroundPayload) => {
		logger.logStoreAction('backgroundStore', 'applyBackground', true, { 
			action: 'start', 
			imageId, 
			mode: payload.mode,
			backgroundId: payload.backgroundId,
			hasPrompt: !!payload.prompt
		});
		set({ applying: true, error: null });
		try {
			const result = await backgroundApi.applyBackground(imageId, payload);
			set({ applying: false });
			logger.logStoreAction('backgroundStore', 'applyBackground', true, { 
				imageId, 
				mode: payload.mode,
				backgroundId: payload.backgroundId,
				finalUrl: result.data.finalUrl,
				creditsDeducted: result.data.creditsDeducted
			});
			return {
				finalUrl: result.data.finalUrl,
				creditsDeducted: result.data.creditsDeducted,
			};
		} catch (err: any) {
			const message = err.response?.data?.message || err.message;
			set({ error: message, applying: false });
			logger.logStoreAction('backgroundStore', 'applyBackground', false, { 
				imageId, 
				mode: payload.mode,
				backgroundId: payload.backgroundId,
				error: message,
				statusCode: err.response?.status
			});
			throw new Error(message);
		}
	},

	clearError: () => set({ error: null }),
}));
