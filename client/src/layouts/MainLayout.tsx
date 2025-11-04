import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuthStore } from '@/store/authStore';
import { useCreditStore } from '@/store/creditStore';
import { useEffect } from 'react';

export default function MainLayout() {
	const isAuthed = useAuthStore((s) => !!s.accessToken || !!s.user);
	const getCredits = useCreditStore((s) => s.get);

	useEffect(() => {
		if (isAuthed) getCredits();
	}, [isAuthed, getCredits]);

	return (
		<div className="max-w-screen">
			<Navbar />

			<main>
				<Outlet />
			</main>
		</div>
	);
}
