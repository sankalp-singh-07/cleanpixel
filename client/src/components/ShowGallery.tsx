import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGalleryStore } from '@/store/galleryStore';
import { useFolderStore } from '@/store/folderStore';
import ImageCard from './ImageCard';
import BackgroundModal from './BackgroundModal';
import AddToFolderModal from './AddToFolderModal';
import CreateFolderModal from './CreateFolderModal';
import { toast } from 'react-toastify';
import { Image as ImageIcon, Upload } from 'lucide-react';
import type { ImageItem } from '@/types/uploadTypes';
import type { CreateFolderPayload, UpdateFolderPayload } from '@/types/folderTypes';

const ShowGallery = () => {
	const { images, loading, error, fetchGallery, sort, page, limit, hasMore, toggleImageVisibility } =
		useGalleryStore();
	const { createFolder } = useFolderStore();

	// Modals
	const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
	const [showBackgroundModal, setShowBackgroundModal] = useState(false);
	const [showAddToFolderModal, setShowAddToFolderModal] = useState(false);
	const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
	const [imageForFolder, setImageForFolder] = useState<string | null>(null);

	useEffect(() => {
		void fetchGallery();
	}, []);

	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		void fetchGallery({ sort: e.target.value, page: 1 });
	};

	const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		void fetchGallery({ limit: Number(e.target.value), page: 1 });
	};

	const handlePageChange = (dir: 'next' | 'prev') => {
		if (dir === 'next' && hasMore) void fetchGallery({ page: page + 1 });
		else if (dir === 'prev' && page > 1)
			void fetchGallery({ page: page - 1 });
	};

	const handleApplyBackground = (image: ImageItem) => {
		if (!image.removedBgUrl) {
			toast.error('This image needs background removal first');
			return;
		}
		setSelectedImage(image);
		setShowBackgroundModal(true);
	};

	const handleAddToFolder = (imageId: string) => {
		setImageForFolder(imageId);
		setShowAddToFolderModal(true);
	};

	const handleToggleImageVisibility = async (imageId: string) => {
		try {
			await toggleImageVisibility(imageId);
			toast.success('Image visibility updated');
		} catch (err: any) {
			toast.error(err.message || 'Failed to update visibility');
		}
	};

	const handleCreateFolder = async (
		data: CreateFolderPayload | UpdateFolderPayload
	) => {
		if (!data.name) return;
		try {
			await createFolder({
				name: data.name,
				description: data.description ?? undefined,
				isPublic: data.isPublic,
			});
			toast.success('Folder created successfully');
			setShowCreateFolderModal(false);
			// Re-open add to folder modal
			if (imageForFolder) {
				setShowAddToFolderModal(true);
			}
		} catch (err: any) {
			toast.error(err.message || 'Failed to create folder');
		}
	};

	if (loading)
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-foreground/60">Loading gallery...</p>
				</div>
			</div>
		);
	if (error)
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-red-500 text-center">{error}</div>
			</div>
		);
	if (!images.length)
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<ImageIcon className="w-20 h-20 text-foreground/20 mx-auto mb-4" />
					<h3 className="text-xl font-semibold text-foreground mb-2">
						No images yet
					</h3>
					<p className="text-foreground/60 mb-6">
						Upload your first image to get started
					</p>
					<Link
						to="/upload"
						className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
					>
						<Upload className="w-5 h-5" />
						Upload Image
					</Link>
				</div>
			</div>
		);

	return (
		<div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-4xl md:text-5xl font-sans font-semibold text-foreground mb-4">
						Your Gallery
					</h1>
					<p className="text-foreground/70 text-lg">
						From original to edited, explore the magic of your photo
						collection. Click the wand icon to apply backgrounds!
					</p>
				</div>

				<div className="flex flex-wrap justify-between gap-4 mb-10">
					<select
						value={sort}
						onChange={handleSortChange}
						className="bg-secondary border border-border rounded-full px-5 py-2.5 text-sm font-medium text-foreground shadow-sm hover:shadow-md transition-shadow focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
					>
						<option value="desc">Latest First</option>
						<option value="asc">Oldest First</option>
					</select>

					<select
						value={limit}
						onChange={handleLimitChange}
						className="bg-secondary border border-border rounded-full px-5 py-2.5 text-sm font-medium text-foreground shadow-sm hover:shadow-md transition-shadow focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
					>
						{[4, 8, 12, 16].map((n) => (
							<option key={n} value={n}>
								{n} per page
							</option>
						))}
					</select>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
					{images.map((img) => (
						<ImageCard
							key={img.id}
							image={img}
							onApplyBackground={() => handleApplyBackground(img)}
							onAddToFolder={() => handleAddToFolder(img.id)}
							showFolderActions={true}
							showVisibilityToggle={true}
							onToggleVisibility={() => handleToggleImageVisibility(img.id)}
						/>
					))}
				</div>

				<div className="flex justify-center items-center gap-4">
					<button
						disabled={page <= 1}
						onClick={() => handlePageChange('prev')}
						className={`px-8 py-3 rounded-full font-semibold transition-all duration-200 ${
							page <= 1
								? 'bg-secondary text-foreground/40 cursor-not-allowed border border-border'
								: 'bg-primary text-white shadow-md hover:shadow-lg hover:bg-accent transform hover:-translate-x-1'
						}`}
					>
						← Previous
					</button>
					<span className="px-6 py-3 bg-secondary text-foreground rounded-full font-semibold shadow-md border border-border cursor-not-allowed">
						Page {page}
					</span>
					<button
						disabled={!hasMore}
						onClick={() => handlePageChange('next')}
						className={`px-8 py-3 rounded-full font-semibold transition-all duration-200 ${
							!hasMore
								? 'bg-secondary text-foreground/40 cursor-not-allowed border border-border'
								: 'bg-primary text-white shadow-md hover:shadow-lg hover:bg-accent transform hover:translate-x-1'
						}`}
					>
						Next →
					</button>
				</div>
			</div>

			{/* Background Modal */}
			{selectedImage && (
				<BackgroundModal
					isOpen={showBackgroundModal}
					onClose={() => {
						setShowBackgroundModal(false);
						setSelectedImage(null);
					}}
					imageId={selectedImage.id}
					removedBgUrl={selectedImage.removedBgUrl!}
					onSuccess={() => fetchGallery()}
				/>
			)}

			{/* Add to Folder Modal */}
			{imageForFolder && (
				<AddToFolderModal
					isOpen={showAddToFolderModal}
					onClose={() => {
						setShowAddToFolderModal(false);
						setImageForFolder(null);
					}}
					imageId={imageForFolder}
					onCreateFolder={() => {
						setShowAddToFolderModal(false);
						setShowCreateFolderModal(true);
					}}
				/>
			)}

			{/* Create Folder Modal */}
			<CreateFolderModal
				isOpen={showCreateFolderModal}
				onClose={() => setShowCreateFolderModal(false)}
				onSubmit={handleCreateFolder}
			/>
		</div>
	);
};

export default ShowGallery;
