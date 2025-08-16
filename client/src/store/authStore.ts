import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = { id: string; email: string; username: string; name: string };

type AuthState = {
	accessToken: string | null;
	user: User | null;
	setAuth: (payload: { accessToken: string; user: User }) => void;
	setAccessToken: (token: string | null) => void;
	clear: () => void;
	isAuthenticated: () => boolean;
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			accessToken: null,
			user: null,
			setAuth: ({ accessToken, user }) => set({ accessToken, user }),
			setAccessToken: (token) => set({ accessToken: token }),
			clear: () => set({ accessToken: null, user: null }),
			isAuthenticated: () => !!get().accessToken && !!get().user,
		}),
		{
			name: 'auth',
			partialize: (s) => ({ accessToken: s.accessToken, user: s.user }),
		}
	)
);
