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
	CirclePercent,
	Home,
	Image,
	Menu,
	Upload,
} from 'lucide-react';

type Props = {
	open: boolean;
	onOpenChange: (v: boolean) => void;
};

export function DropdownMenuComponent({ open, onOpenChange }: Props) {
	const itemWrap = 'hover:bg-orange-400 focus:bg-orange-400';
	const linkBase =
		'w-full text-white text-base font-semibold cursor-pointer flex items-center justify-between gap-3';

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
							Plans
							<DropdownMenuShortcut>
								<CirclePercent />
							</DropdownMenuShortcut>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

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
					<DropdownMenuItem asChild className={itemWrap}>
						<Link
							to="/logout"
							onClick={() => onOpenChange(false)}
							className={linkBase}
						>
							Log out
							<DropdownMenuShortcut>⇧⌘L</DropdownMenuShortcut>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
