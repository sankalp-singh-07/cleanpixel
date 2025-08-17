import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiLogin, apiLogout, apiMe, apiSignUp } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import type { LoginResponse } from '@/types/authTypes';

const useAuth = () => {
	const navigate = useNavigate();

	const {
		accessToken,
		user,
		setAuth,
		setAccessToken,
		clear,
		isAuthenticated,
	} = useAuthStore();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<unknown>(null);

	const login = async (email: string, password: string) => {
		setError(null);
		setLoading(true);
		try {
			const res = (await apiLogin(email, password)) as LoginResponse;
			setAuth({ accessToken: res.accessToken, user: res.user });
			return res;
		} catch (e) {
			setError(e);
			throw e;
		} finally {
			setLoading(false);
		}
	};

	const signup = async (
		email: string,
		username: string,
		password: string,
		name: string
	) => {
		setError(null);
		setLoading(true);
		try {
			return await apiSignUp(email, username, password, name);
		} catch (e) {
			setError(e);
			throw e;
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		setError(null);
		setLoading(true);
		try {
			await apiLogout();
		} catch (e) {
			setError(e);
		} finally {
			clear();
			setLoading(false);
			navigate('/login');
		}
	};

	const hydrateUser = async () => {
		if (!accessToken) {
			navigate('/login');
			return;
		}

		setError(null);
		setLoading(true);
		try {
			const me = await apiMe();
			setAuth({ accessToken, user: me });
		} catch (e) {
			clear();
			setError(e);
			navigate('/login');
		} finally {
			setLoading(false);
		}
	};

	return {
		login,
		signup,
		logout,
		hydrateUser,
		accessToken,
		user,
		isAuthenticated: isAuthenticated(),
		loading,
		error,
		setAuth,
		setAccessToken,
		clear,
	};
};

export default useAuth;
