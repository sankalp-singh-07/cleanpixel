import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenuComponent } from '../ui/DropdownMenu';
import { Home, Image, LogOut, Upload } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import DarkModeToggle from './DarkButton';
import { Spinner } from './Spinner';
import ShowCredits from './ShowCredits';
// import ShowCredits from './ShowCredits';

const linkBase =
	'text-foreground/80 hover:text-primary/80 transition-colors px-3 py-2 rounded-lg flex items-center gap-2';
const activeLink = 'text-primary underline underline-offset-4 decoration-2';

const Navbar = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const [loggingOut, setLoggingOut] = useState(false);
	const location = useLocation();

	const { logout } = useAuth();
	const isAuthed = useAuthStore((s) => s.isAuthenticated());

	const handleLogout = async () => {
		if (loggingOut) return;
		setLoggingOut(true);
		try {
			await logout();
		} finally {
			setLoggingOut(false);
		}
	};

	useEffect(() => {
		setMenuOpen(false);
	}, [location.pathname]);

	useEffect(() => {
		const mql = window.matchMedia('(min-width: 768px)');
		const handle = (e: MediaQueryListEvent | MediaQueryList) => {
			const matches =
				'matches' in e ? e.matches : (e as MediaQueryList).matches;
			if (matches) setMenuOpen(false);
		};
		handle(mql);
		mql.addEventListener(
			'change',
			handle as (ev: MediaQueryListEvent) => void
		);
		return () =>
			mql.removeEventListener(
				'change',
				handle as (ev: MediaQueryListEvent) => void
			);
	}, []);

	return (
		<header className="sticky top-0 z-50 border-b border-foreground/20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto max-w-7xl px-4">
				<div className="flex h-16 items-center justify-between">
					<Link to="/" className="select-none">
						<span className="text-2xl font-sans text-foreground font-semibold tracking-tight">
							CLEANPIXEL<span className="text-primary">.</span>
						</span>
					</Link>

					<nav
						aria-label="Primary"
						className="hidden md:flex items-center gap-1"
					>
						<NavLink
							to="/"
							end
							className={({ isActive }) =>
								`${linkBase} ${isActive ? activeLink : ''}`
							}
						>
							<Home className="w-4 h-4" />
							Home
						</NavLink>
						<NavLink
							to="/gallery"
							className={({ isActive }) =>
								`${linkBase} ${isActive ? activeLink : ''}`
							}
						>
							<Image className="w-4 h-4" />
							Gallery
						</NavLink>
						<NavLink
							to="/upload"
							className={({ isActive }) =>
								`${linkBase} ${isActive ? activeLink : ''}`
							}
						>
							<Upload className="w-4 h-4" />
							Upload
						</NavLink>
					</nav>

					<div className="flex items-center gap-2">
						{isAuthed && (
							<div className="hidden md:block">
								<ShowCredits />
							</div>
						)}
						<DarkModeToggle />

						<div className="hidden md:block">
							{!isAuthed ? (
								<Button
									asChild
									className="rounded-3xl pt-1 pb-1.5 px-6 text-base text-white shadow-sm"
								>
									<Link to="/register">Get Started</Link>
								</Button>
							) : (
								<span
									onClick={handleLogout}
									className="rounded-3xl px-5 py-2 text-base dark:text-white shadow-sm text-primary cursor-pointer"
									aria-busy={loggingOut}
								>
									{loggingOut ? (
										<Spinner
											size={22}
											className="text-primary dark:text-white"
										/>
									) : (
										<LogOut className="w-6 h-6 text-current" />
									)}
								</span>
							)}
						</div>

						<div className="md:hidden">
							<DropdownMenuComponent
								open={menuOpen}
								onOpenChange={setMenuOpen}
							/>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
