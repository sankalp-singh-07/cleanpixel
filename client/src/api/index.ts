import { useAuthStore } from '@/store/authStore';
import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 15000,
	withCredentials: true,
});

const refreshClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
});

export const tokenHelpers = {
	getToken: () => useAuthStore.getState().accessToken,
	setToken: (t: string) => useAuthStore.getState().setAccessToken(t),
	clearAll: () => {
		useAuthStore.getState().clear();
		delete api.defaults.headers.common['Authorization'];
	},
};

const PUBLIC_PATHS = ['/login', '/signup', '/refresh', '/logout'];

const pathOf = (u?: string) => {
	try {
		const base =
			(import.meta.env.VITE_API_URL || '').replace(/\/$/, '') ||
			'http://x';
		return new URL(u || '', base).pathname.toLowerCase();
	} catch {
		return (u || '').toLowerCase();
	}
};

api.interceptors.request.use(
	(config) => {
		const token = tokenHelpers.getToken();
		const path = pathOf(config.url);
		const isPublic = PUBLIC_PATHS.some(
			(p) => path === p || path.startsWith(`${p}/`)
		);
		if (token && !isPublic) {
			config.headers = config.headers ?? {};
			(config.headers as Record<string, string>)[
				'Authorization'
			] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

let refreshPromise: Promise<string> | null = null;

async function refreshToken(): Promise<string> {
	if (!refreshPromise) {
		refreshPromise = refreshClient
			.post<{ accessToken: string }>('/refresh')
			.then(({ data }) => {
				const newToken = data.accessToken;
				tokenHelpers.setToken(newToken);
				api.defaults.headers.common[
					'Authorization'
				] = `Bearer ${newToken}`;
				return newToken;
			})
			.finally(() => {
				refreshPromise = null;
			});
	}
	return refreshPromise;
}

api.interceptors.response.use(
	(res) => res,
	async (error: AxiosError) => {
		const original = error.config as
			| (AxiosRequestConfig & { _retry?: boolean })
			| undefined;
		const status = error.response?.status;

		if (!original) return Promise.reject(error);

		const path = pathOf(original.url);
		const isPublic = PUBLIC_PATHS.some(
			(p) => path === p || path.startsWith(`${p}/`)
		);
		const isAuthErr = status === 401 || status === 419 || status === 440;

		if (!isAuthErr || original._retry || isPublic) {
			return Promise.reject(error);
		}

		original._retry = true;

		try {
			const newToken = await refreshToken();
			original.headers = {
				...(original.headers || {}),
				Authorization: `Bearer ${newToken}`,
			};
			return api(original);
		} catch (e) {
			tokenHelpers.clearAll();
			return Promise.reject(e);
		}
	}
);

export default api;
