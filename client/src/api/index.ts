import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

export const tokenHelpers = {
	getToken: () => localStorage.getItem('accessToken'),
	setToken: (t: string) => localStorage.setItem('accessToken', t),
	clearToken: () => localStorage.removeItem('accessToken'),
};

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 15000,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true,
});

const PUBLIC_PATHS = ['/login', '/signup', '/refresh', '/logout'];

api.interceptors.request.use(
	(config) => {
		const token = tokenHelpers.getToken();

		const url = (config.url || '').toLowerCase();
		const isPublic = PUBLIC_PATHS.some((p) => url.startsWith(p));

		if (token && !isPublic) {
			config.headers = config.headers ?? {};
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

api.interceptors.response.use(
	(res) => res,
	async (error: AxiosError) => {
		const original = error.config as AxiosRequestConfig & {
			_retry?: boolean;
		};

		if (error.response?.status !== 401 || original?._retry) {
			return Promise.reject(error);
		}
		original._retry = true;

		try {
			const baseURL = process.env.REACT_APP_BASE_URL;
			const refreshRes = await axios.get(`${baseURL}/auth/refresh`, {
				withCredentials: true,
			});

			const newToken = (refreshRes.data as any)?.accessToken;
			if (newToken) {
				tokenHelpers.setToken(newToken);
				api.defaults.headers.common[
					'Authorization'
				] = `Bearer ${newToken}`;
			}

			return api(original);
		} catch (e) {
			tokenHelpers.clearToken();
			return Promise.reject(e);
		}
	}
);

export default api;
