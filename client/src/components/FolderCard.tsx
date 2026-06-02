import { Folder, MoreVertical, Trash2, Edit, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { Folder as FolderType } from '@/types/folderTypes';

type Props = {
	folder: FolderType;
	onClick: () => void;
	onEdit: () => void;
	onDelete: () => void;
	onToggleVisibility: () => void;
	username?: string;
};

const FolderCard = ({ folder, onClick, onEdit, onDelete, onToggleVisibility, username }: Props) => {
	const [showMenu, setShowMenu] = useState(false);

	const publicUrl = username && folder.isPublic 
		? `${window.location.origin}/u/${username}/folder/${folder.id}`
		: null;

	const copyPublicUrl = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (publicUrl) {
			navigator.clipboard.writeText(publicUrl);
			setShowMenu(false);
		}
	};

	return (
		<div
			onClick={onClick}
			className="group relative bg-secondary rounded-2xl p-4 border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
		>
			{/* Thumbnail or Icon */}
			<div className="aspect-video rounded-xl overflow-hidden bg-background/50 mb-3 flex items-center justify-center">
				{folder.thumbnailUrl ? (
					<img
						src={folder.thumbnailUrl}
						alt={folder.name}
						className="w-full h-full object-cover"
					/>
				) : (
					<Folder className="w-16 h-16 text-primary/30" />
				)}
			</div>

			{/* Content */}
			<div className="space-y-1">
				<h3 className="font-semibold text-foreground truncate">{folder.name}</h3>
				{folder.description && (
					<p className="text-sm text-foreground/60 line-clamp-2">{folder.description}</p>
				)}
				<div className="flex items-center gap-2 pt-1">
					<span
						className={`text-xs px-2 py-0.5 rounded-full ${
							folder.isPublic
								? 'bg-green-500/10 text-green-600 dark:text-green-400'
								: 'bg-foreground/10 text-foreground/60'
						}`}
					>
						{folder.isPublic ? 'Public' : 'Private'}
					</span>
					<span className="text-xs text-foreground/40">
						{new Date(folder.createdAt).toLocaleDateString('en-GB', {
							day: '2-digit',
							month: 'short',
							year: 'numeric',
						})}
					</span>
				</div>
			</div>

			{/* Menu Button */}
			<div className="absolute top-3 right-3">
				<button
					onClick={(e) => {
						e.stopPropagation();
						setShowMenu(!showMenu);
					}}
					className="p-1.5 rounded-full bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
				>
					<MoreVertical className="w-4 h-4 text-foreground/70" />
				</button>

				{/* Dropdown Menu */}
				{showMenu && (
					<>
						<div
							className="fixed inset-0 z-10"
							onClick={(e) => {
								e.stopPropagation();
								setShowMenu(false);
							}}
						/>
						<div className="absolute right-0 top-8 z-20 w-48 py-1 bg-background border border-border rounded-xl shadow-xl">
							<button
								onClick={(e) => {
									e.stopPropagation();
									onEdit();
									setShowMenu(false);
								}}
								className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-secondary flex items-center gap-2"
							>
								<Edit className="w-4 h-4" />
								Edit Folder
							</button>
							<button
								onClick={(e) => {
									e.stopPropagation();
									onToggleVisibility();
									setShowMenu(false);
								}}
								className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-secondary flex items-center gap-2"
							>
								{folder.isPublic ? (
									<>
										<EyeOff className="w-4 h-4" />
										Make Private
									</>
								) : (
									<>
										<Eye className="w-4 h-4" />
										Make Public
									</>
								)}
							</button>
							{publicUrl && (
								<button
									onClick={copyPublicUrl}
									className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-secondary flex items-center gap-2"
								>
									<ExternalLink className="w-4 h-4" />
									Copy Public URL
								</button>
							)}
							<hr className="my-1 border-border" />
							<button
								onClick={(e) => {
									e.stopPropagation();
									onDelete();
									setShowMenu(false);
								}}
								className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2"
							>
								<Trash2 className="w-4 h-4" />
								Delete Folder
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default FolderCard;
