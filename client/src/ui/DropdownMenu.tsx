import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import {
	ArrowRightIcon,
	DollarSign,
	Home,
	Image,
	Menu,
	Upload,
	User,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import useAuth from '@/hooks/useAuth';

type Props = {
	open: boolean;
	onOpenChange: (v: boolean) => void;
};

export function DropdownMenuComponent({ open, onOpenChange }: Props) {
	const itemWrap = 'hover:bg-orange-400 focus:bg-orange-400';
	const linkBase =
		'w-full text-white text-sm font-medium cursor-pointer flex items-center justify-between gap-3 break-words'; // ⬅ changed

	const user = useAuthStore((s) => s.user);
	const { logout } = useAuth();

	const handleLogout = async () => {
		onOpenChange(false);
		await logout();
	};

	return (
		<DropdownMenu open={open} onOpenChange={onOpenChange}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					aria-label="Open menu"
					className="rounded-xl hover:bg-primary/70 cursor-pointer focus-visible:ring-0"
				>
					<Menu className="h-5 w-5" aria-hidden="true" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				className="w-56 bg-primary border-none"
				align="end"
				sideOffset={10}
			>
				{user && (
					<>
						<div className="flex flex-col px-2 py-1.5 gap-2">
							<span className="font-medium flex gap-2 items-start text-sm text-white break-words">
								<User className="w-4 h-4 shrink-0 mt-0.5" />
								Hi! {user.username}
							</span>

							<span className="font-medium text-sm text-white">
								Credits : 5
							</span>
						</div>

						<DropdownMenuSeparator />
					</>
				)}

				<DropdownMenuGroup>
					<DropdownMenuItem asChild className={itemWrap}>
						<Link
							to="/"
							onClick={() => onOpenChange(false)}
							className={linkBase}
						>
							Home
							<DropdownMenuShortcut>
								<Home />
							</DropdownMenuShortcut>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild className={itemWrap}>
						<Link
							to="/gallery"
							onClick={() => onOpenChange(false)}
							className={linkBase}
						>
							Gallery
							<DropdownMenuShortcut>
								<Image />
							</DropdownMenuShortcut>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild className={itemWrap}>
						<Link
							to="/upload"
							onClick={() => onOpenChange(false)}
							className={linkBase}
						>
							Upload
							<DropdownMenuShortcut>
								<Upload />
							</DropdownMenuShortcut>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				{user && (
					<DropdownMenuGroup>
						<DropdownMenuItem asChild className={itemWrap}>
							<Link
								to="/invite"
								onClick={() => onOpenChange(false)}
								className={linkBase}
							>
								Invite Users
								<DropdownMenuShortcut>
									<ArrowRightIcon />
								</DropdownMenuShortcut>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild className={itemWrap}>
							<Link
								to="/pricing"
								onClick={() => onOpenChange(false)}
								className={linkBase}
							>
								Buy Credits
								<DropdownMenuShortcut>
									<DollarSign />
								</DropdownMenuShortcut>
							</Link>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				)}

				{user && <DropdownMenuSeparator />}

				<DropdownMenuGroup>
					<DropdownMenuItem asChild className={itemWrap}>
						<Link
							to="/contact"
							onClick={() => onOpenChange(false)}
							className={linkBase}
						>
							Contact Us
							<DropdownMenuShortcut>⇧⌘C</DropdownMenuShortcut>
						</Link>
					</DropdownMenuItem>

					{!user ? (
						<>
							<DropdownMenuItem asChild className={itemWrap}>
								<Link
									to="/register"
									onClick={() => onOpenChange(false)}
									className={linkBase}
								>
									Get Started
									<DropdownMenuShortcut>
										⇧⌘G
									</DropdownMenuShortcut>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild className={itemWrap}>
								<Link
									to="/login"
									onClick={() => onOpenChange(false)}
									className={linkBase}
								>
									Login
									<DropdownMenuShortcut>
										⇧⌘L
									</DropdownMenuShortcut>
								</Link>
							</DropdownMenuItem>
						</>
					) : (
						<DropdownMenuItem asChild className={itemWrap}>
							<button
								type="button"
								onClick={handleLogout}
								className={linkBase}
							>
								Logout
								<DropdownMenuShortcut>⇧⌘L</DropdownMenuShortcut>
							</button>
						</DropdownMenuItem>
					)}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
