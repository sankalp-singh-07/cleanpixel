import { useState } from 'react';
import { Download, Eye, EyeOff, Wand2, FolderPlus, Trash2, MoreVertical } from 'lucide-react';

type ImageData = {
	id: string;
	originalUrl: string;
	removedBgUrl?: string | null;
	replacedUrl?: string | null;
	isPublic?: boolean;
	type?: string | null;
	createdAt: string;
};

type Props = {
	image: ImageData;
	onApplyBackground?: () => void;
	onAddToFolder?: () => void;
	onRemoveFromFolder?: () => void;
	onToggleVisibility?: () => void;
	showVisibilityToggle?: boolean;
	showFolderActions?: boolean;
	isInFolder?: boolean;
};

const ImageCard = ({
	image,
	onApplyBackground,
	onAddToFolder,
	onRemoveFromFolder,
	onToggleVisibility,
	showVisibilityToggle = false,
	showFolderActions = false,
	isInFolder = false,
}: Props) => {
	const [viewMode, setViewMode] = useState<'original' | 'removed' | 'replaced'>('original');
	const [showMenu, setShowMenu] = useState(false);

	const hasRemovedBg = !!image.removedBgUrl;
	const hasReplacedBg = !!image.replacedUrl;

	const currentImage =
		viewMode === 'replaced' && hasReplacedBg
			? image.replacedUrl!
			: viewMode === 'removed' && hasRemovedBg
			? image.removedBgUrl!
			: image.originalUrl;

	const viewLabel =
		viewMode === 'replaced'
			? 'With Background'
			: viewMode === 'removed'
			? 'Removed BG'
			: 'Original';

	const cycleView = () => {
		if (hasReplacedBg) {
			setViewMode((prev) =>
				prev === 'original' ? 'removed' : prev === 'removed' ? 'replaced' : 'original'
			);
		} else if (hasRemovedBg) {
			setViewMode((prev) => (prev === 'original' ? 'removed' : 'original'));
		}
	};

	return (
		<div className="group relative bg-secondary rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border">
			{/* Image */}
			<div
				className={`aspect-[3/4] overflow-hidden ${
					viewMode !== 'original' ? "bg-[url('/checker.svg')] bg-repeat" : ''
				}`}
			>
				<img
					src={currentImage}
					alt="Gallery"
					className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
					onError={(e) => (e.currentTarget.src = '/placeholder-image.png')}
				/>
			</div>

			{/* Gradient Overlay */}
			<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

			{/* Bottom Info */}
			<div className="absolute bottom-0 left-0 right-0 p-3">
				<div className="flex justify-between items-center">
					<span className="text-xs font-medium bg-primary/90 text-white px-2 py-1 rounded-full">
						{new Date(image.createdAt).toLocaleDateString('en-GB', {
							day: '2-digit',
							month: 'short',
						})}
					</span>
					<span className="text-xs font-medium bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full">
						{viewLabel}
					</span>
				</div>
			</div>

			{/* Hover Actions */}
			<div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
				{/* Menu Button */}
				{(showVisibilityToggle || showFolderActions) && (
					<div className="relative">
						<button
							onClick={() => setShowMenu(!showMenu)}
							className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
						>
							<MoreVertical className="w-4 h-4 text-gray-700" />
						</button>

						{showMenu && (
							<>
								<div
									className="fixed inset-0 z-10"
									onClick={() => setShowMenu(false)}
								/>
								<div className="absolute right-0 top-10 z-20 w-44 py-1 bg-background border border-border rounded-xl shadow-xl">
									{showVisibilityToggle && onToggleVisibility && (
										<button
											onClick={() => {
												onToggleVisibility();
												setShowMenu(false);
											}}
											className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-secondary flex items-center gap-2"
										>
											{image.isPublic ? (
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
									)}
									{showFolderActions && !isInFolder && onAddToFolder && (
										<button
											onClick={() => {
												onAddToFolder();
												setShowMenu(false);
											}}
											className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-secondary flex items-center gap-2"
										>
											<FolderPlus className="w-4 h-4" />
											Add to Folder
										</button>
									)}
									{isInFolder && onRemoveFromFolder && (
										<button
											onClick={() => {
												onRemoveFromFolder();
												setShowMenu(false);
											}}
											className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2"
										>
											<Trash2 className="w-4 h-4" />
											Remove from Folder
										</button>
									)}
								</div>
							</>
						)}
					</div>
				)}

				{/* View Toggle */}
				{(hasRemovedBg || hasReplacedBg) && (
					<button
						onClick={cycleView}
						className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
						title="Toggle view"
					>
						<Eye className="w-4 h-4 text-gray-700" />
					</button>
				)}

				{/* Apply Background */}
				{hasRemovedBg && onApplyBackground && (
					<button
						onClick={onApplyBackground}
						className="p-2 bg-primary/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-primary transition-colors"
						title="Apply background"
					>
						<Wand2 className="w-4 h-4 text-white" />
					</button>
				)}

				{/* Download */}
				<a
					href={currentImage}
					download
					className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
					title="Download"
				>
					<Download className="w-4 h-4 text-gray-700" />
				</a>
			</div>

			{/* Public Badge */}
			{showVisibilityToggle && image.isPublic && (
				<div className="absolute top-3 left-3">
					<span className="text-xs font-medium bg-green-500/90 text-white px-2 py-1 rounded-full">
						Public
					</span>
				</div>
			)}
		</div>
	);
};

export default ImageCard;
