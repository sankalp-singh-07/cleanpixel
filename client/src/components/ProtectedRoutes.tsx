import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import type { JSX } from 'react';

export default function ProtectedRoute({
	children,
}: {
	children: JSX.Element;
}) {
	const isAuthed = useAuthStore((s) => s.isAuthenticated());
	return isAuthed ? children : <Navigate to="/login" replace />;
}
