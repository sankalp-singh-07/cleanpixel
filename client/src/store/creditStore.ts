import { fetchCreditsApi } from '@/api/credit';
import { create } from 'zustand';

type CreditStoreType = {
	credits: number | null;
	loading: boolean;
	error: string | null;
	get: () => Promise<number>;
	setFromServer: (n: number) => void;
	clear: () => void;
};

let inflightPromise: Promise<any> | null = null;

export const useCreditStore = create<CreditStoreType>((set) => ({
	credits: null,
	loading: false,
	error: null,

	async get() {
		if (inflightPromise) {
			return inflightPromise;
		}

		set({ loading: true, error: null });

		inflightPromise = fetchCreditsApi()
			.then((value) => {
				set({ credits: value });
				return value;
			})
			.catch((e: any) => {
				set({
					error:
						e?.response?.data?.message || 'Failed to fetch credits',
				});
				throw e;
			})
			.finally(() => {
				set({ loading: false });
				inflightPromise = null;
			});

		return inflightPromise;
	},

	setFromServer(n) {
		set({ credits: n });
	},
	clear() {
		set({ credits: null, error: null });
	},
}));
