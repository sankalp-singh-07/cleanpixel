import { useAuthStore } from '@/store/authStore';
import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { logger } from '@/utils/logger';
import { errorTracker } from '@/utils/errorTracker';

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
		const startTime = Date.now();
		config.metadata = { startTime };
		
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
		
		// Log API request
		logger.logApiRequest(
			config.method?.toUpperCase() || 'GET', 
			config.url || '', 
			{
				baseURL: config.baseURL,
				timeout: config.timeout,
				hasAuth: !isPublic && !!token,
				data: config.data ? Object.keys(config.data) : undefined
			}
		);
		
		return config;
	},
	(error) => {
		logger.error('API request interceptor error', {
			error: {
				name: error.name,
				message: error.message,
				stack: error.stack
			}
		});
		return Promise.reject(error);
	}
);

let refreshPromise: Promise<string> | null = null;

async function refreshToken(): Promise<string> {
	if (!refreshPromise) {
		logger.info('Refreshing authentication token');
		refreshPromise = refreshClient
			.post<{ accessToken: string }>('/refresh')
			.then(({ data }) => {
				const newToken = data.accessToken;
				tokenHelpers.setToken(newToken);
				api.defaults.headers.common[
					'Authorization'
				] = `Bearer ${newToken}`;
				logger.info('Token refreshed successfully');
				return newToken;
			})
			.catch((error) => {
				logger.error('Token refresh failed', {
					error: {
						name: error.name,
						message: error.message,
					},
					statusCode: error.response?.status
				});
				throw error;
			})
			.finally(() => {
				refreshPromise = null;
			});
	}
	return refreshPromise;
}

api.interceptors.response.use(
	(res) => {
		const duration = Date.now() - (res.config.metadata?.startTime || 0);
		
		// Log successful API response
		logger.logApiResponse(
			res.config.method?.toUpperCase() || 'GET',
			res.config.url || '',
			res.status,
			duration,
			{
				success: res.data?.success,
				dataSize: res.data ? JSON.stringify(res.data).length : 0
			}
		);
		
		return res;
	},
	async (error: AxiosError) => {
		const original = error.config as
			| (AxiosRequestConfig & { _retry?: boolean; metadata?: { startTime: number } })
			| undefined;
		const status = error.response?.status;
		const duration = original?.metadata ? Date.now() - original.metadata.startTime : 0;

		// Track and log API error response
		if (original) {
			const method = original.method?.toUpperCase() || 'GET';
			const url = original.url || '';
			
			logger.logApiResponse(method, url, status || 0, duration, {
				success: false,
				errorMessage: error.message,
				errorData: error.response?.data
			});
			
			// Track error for debugging
			errorTracker.trackApiError({
				url,
				method,
				statusCode: status,
				responseData: error.response?.data,
				requestData: original.data,
				duration,
				userAgent: navigator.userAgent,
			});
		}

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
		logger.info('Attempting token refresh due to auth error', { status, url: original.url });

		try {
			const newToken = await refreshToken();
			original.headers = {
				...(original.headers || {}),
				Authorization: `Bearer ${newToken}`,
			};
			logger.info('Retrying request with new token', { url: original.url });
			return api(original);
		} catch (e) {
			logger.error('Token refresh failed, clearing auth state', {
				originalError: error.message,
				refreshError: e instanceof Error ? e.message : 'Unknown error'
			});
			tokenHelpers.clearAll();
			return Promise.reject(e);
		}
	}
);

export default api;
