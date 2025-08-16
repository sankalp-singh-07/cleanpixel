import type { LoginResponse, SignupResponse } from '@/types/authTypes';
import api from '.';

export const signUp = async (
	email: string,
	username: string,
	password: string,
	name: string
) => {
	const user = { email, username, password, name };
	const res = await api.post<SignupResponse>('/signup', { user });
	const data = res.data;
	return data;
};

export const login = async (email: string, password: string) => {
	const user = { email, password };
	const res = await api.post<LoginResponse>('/login', { user });
	const data = res.data;
	localStorage.setItem('access_token', data.accessToken);
	return data;
};

export const logout = async () => {
	await api.post('/logout');
	localStorage.removeItem('access_token');
	window.location.href = '/login';
};
