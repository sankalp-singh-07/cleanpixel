import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function MainLayout() {
	return (
		<div className="max-w-screen">
			<Navbar />

			<main>
				<Outlet />
			</main>

			<footer>
				<p>Footer</p>
			</footer>
		</div>
	);
}
