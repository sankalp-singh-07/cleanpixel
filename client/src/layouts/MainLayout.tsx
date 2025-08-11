import { Outlet, NavLink } from 'react-router-dom';

export default function MainLayout() {
	return (
		<div>
			<header>
				<nav>
					<NavLink to="/">Home</NavLink>
					<NavLink to="/gallery">Gallery</NavLink>
					<NavLink to="/upload">Upload</NavLink>
				</nav>
			</header>

			<main>
				<Outlet />
			</main>

			<footer>
				<p>Footer</p>
			</footer>
		</div>
	);
}
