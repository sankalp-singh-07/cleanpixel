import type { MeRes, LoginResponse, SignupResponse } from '@/types/authTypes';
import api from '.';

export async function apiSignUp(
	email: string,
	username: string,
	password: string,
	name: string
): Promise<SignupResponse> {
	const { data } = await api.post<SignupResponse>('/signup', {
		user: { email, username, password, name },
	});
	return data;
}

export async function apiLogin(
	email: string,
	password: string
): Promise<LoginResponse> {
	const { data } = await api.post<LoginResponse>('/login', {
		user: { email, password },
	});
	return data;
}

export async function apiLogout(): Promise<void> {
	await api.post('/logout');
}

export async function apiMe(): Promise<MeRes['user']> {
	const { data } = await api.get<MeRes>('/me');
	return data.user;
}
