import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
	ArrowLeft,
	Settings,
	Copy,
	Check,
	Loader2,
	ImageIcon,
	AlertCircle,
	RefreshCw,
} from 'lucide-react';
import { useFolderStore } from '@/store/folderStore';
import { useAuthStore } from '@/store/authStore';
import ImageCard from '@/components/ImageCard';
import BackgroundModal from '@/components/BackgroundModal';
import CreateFolderModal from '@/components/CreateFolderModal';
import ErrorBoundary from '@/components/ErrorBoundary';
import { toast } from 'react-toastify';
import type { FolderImage, UpdateFolderPayload } from '@/types/folderTypes';
import { logger } from '@/utils/logger';

const FolderDetail = () => {
	const { folderId } = useParams<{ folderId: string }>();
	const navigate = useNavigate();
	const user = useAuthStore((s) => s.user);
	const {
		currentFolder,
		loading,
		error,
		fetchFolder,
		updateFolder,
		removeImage,
		clearCurrentFolder,
		clearError,
	} = useFolderStore();

	const [showEditModal, setShowEditModal] = useState(false);
	const [copied, setCopied] = useState(false);
	const [selectedImage, setSelectedImage] = useState<FolderImage | null>(null);
	const [showBackgroundModal, setShowBackgroundModal] = useState(false);
	const [retryCount, setRetryCount] = useState(0);
	const [isRetrying, setIsRetrying] = useState(false);

	// Validate folder ID format
	const isValidFolderId = (id: string | undefined): boolean => {
		if (!id) return false;
		// CleanPixel uses cuid format: starts with 'c' followed by 24 alphanumeric characters
		return /^c[a-z0-9]{24}$/.test(id);
	};

	const handleRetry = async () => {
		if (!folderId || isRetrying) return;
		
		setIsRetrying(true);
		setRetryCount(prev => prev + 1);
		clearError();
		
		logger.logUserAction('retry_folder_fetch', 'FolderDetail', { 
			folderId, 
			retryCount: retryCount + 1 
		});
		
		try {
			await fetchFolder(folderId);
		} catch (err) {
			const errorObj = err instanceof Error ? {
				name: err.name,
				message: err.message,
				stack: err.stack
			} : {
				name: 'UnknownError',
				message: String(err),
				stack: undefined
			};
			
			logger.error('Retry failed for folder fetch', {
				component: 'FolderDetail',
				folderId,
				retryCount: retryCount + 1,
				error: errorObj
			});
		} finally {
			setIsRetrying(false);
		}
	};

	const getErrorType = (errorMessage: string | null): 'not_found' | 'unauthorized' | 'network' | 'server' | 'invalid_id' => {
		if (!errorMessage) return 'server';
		
		const message = errorMessage.toLowerCase();
		
		if (message.includes('not found') || message.includes('404')) {
			return 'not_found';
		}
		if (message.includes('unauthorized') || message.includes('403') || message.includes('401')) {
			return 'unauthorized';
		}
		// Check for database/server errors first before network errors
		if (message.includes('database') || message.includes('prisma') || message.includes('500') || message.includes('server error')) {
			return 'server';
		}
		if (message.includes('network') || message.includes('fetch') || message.includes('timeout') || message.includes('connection')) {
			return 'network';
		}
		
		return 'server';
	};

	const renderErrorState = () => {
		if (!folderId) {
			return (
				<div className="min-h-screen bg-background flex items-center justify-center">
					<div className="text-center max-w-md mx-auto p-6">
						<AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
						<h2 className="text-2xl font-semibold text-foreground mb-2">Invalid Folder URL</h2>
						<p className="text-foreground/60 mb-6">
							The folder URL is missing or malformed. Please check the link and try again.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<button
								onClick={() => navigate('/folders')}
								className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
							>
								View All Folders
							</button>
							<button
								onClick={() => navigate('/gallery')}
								className="px-6 py-3 bg-secondary text-foreground rounded-full font-medium hover:bg-secondary/80 transition-colors"
							>
								Go to Gallery
							</button>
						</div>
					</div>
				</div>
			);
		}

		if (!isValidFolderId(folderId)) {
			return (
				<div className="min-h-screen bg-background flex items-center justify-center">
					<div className="text-center max-w-md mx-auto p-6">
						<AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
						<h2 className="text-2xl font-semibold text-foreground mb-2">Invalid Folder ID</h2>
						<p className="text-foreground/60 mb-2">
							The folder ID format is not valid.
						</p>
						<p className="text-sm text-foreground/40 mb-6 font-mono bg-secondary px-3 py-2 rounded">
							ID: {folderId}
						</p>
						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<button
								onClick={() => navigate('/folders')}
								className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
							>
								View All Folders
							</button>
							<button
								onClick={() => navigate('/gallery')}
								className="px-6 py-3 bg-secondary text-foreground rounded-full font-medium hover:bg-secondary/80 transition-colors"
							>
								Go to Gallery
							</button>
						</div>
					</div>
				</div>
			);
		}

		const errorType = getErrorType(error);
		
		const errorConfig = {
			not_found: {
				icon: <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />,
				title: "Folder Not Found",
				description: "This folder doesn't exist or you don't have permission to view it.",
				canRetry: false,
			},
			unauthorized: {
				icon: <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />,
				title: "Access Denied",
				description: "You don't have permission to view this folder. It may be private or belong to another user.",
				canRetry: false,
			},
			network: {
				icon: <AlertCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />,
				title: "Connection Problem",
				description: "Unable to connect to the server. Please check your internet connection and try again.",
				canRetry: true,
			},
			server: {
				icon: <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />,
				title: "Server Error",
				description: "Something went wrong on our end. Our team has been notified and is working on a fix.",
				canRetry: true,
			},
			invalid_id: {
				icon: <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />,
				title: "Invalid Folder ID",
				description: "The folder ID format is not valid.",
				canRetry: false,
			},
		};

		const config = errorConfig[errorType];

		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center max-w-md mx-auto p-6">
					{config.icon}
					<h2 className="text-2xl font-semibold text-foreground mb-2">{config.title}</h2>
					<p className="text-foreground/60 mb-2">{config.description}</p>
					
					{error && (
						<details className="mb-6 text-left">
							<summary className="text-sm text-foreground/40 cursor-pointer hover:text-foreground/60 mb-2">
								Technical Details
							</summary>
							<p className="text-xs text-foreground/40 font-mono bg-secondary px-3 py-2 rounded break-all">
								{error}
							</p>
						</details>
					)}

					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						{config.canRetry && (
							<button
								onClick={handleRetry}
								disabled={isRetrying}
								className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
							>
								{isRetrying ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin" />
										Retrying...
									</>
								) : (
									<>
										<RefreshCw className="w-4 h-4" />
										Try Again {retryCount > 0 && `(${retryCount})`}
									</>
								)}
							</button>
						)}
						<button
							onClick={() => navigate('/folders')}
							className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
						>
							View All Folders
						</button>
						<button
							onClick={() => navigate('/gallery')}
							className="px-6 py-3 bg-secondary text-foreground rounded-full font-medium hover:bg-secondary/80 transition-colors"
						>
							Go to Gallery
						</button>
					</div>
				</div>
			</div>
		);
	};

	useEffect(() => {
		logger.logComponentMount('FolderDetail', { folderId });
		
		// Clear any previous errors when component mounts
		clearError();
		
		if (folderId) {
			// Validate folder ID before making API call
			if (!isValidFolderId(folderId)) {
				logger.warn('Invalid folder ID format detected', {
					component: 'FolderDetail',
					folderId,
					expectedFormat: 'c[a-z0-9]{24}'
				});
				// Don't make API call for invalid IDs, let the error state handle it
				return;
			}
			
			logger.logNavigation('unknown', `/folders/${folderId}`, { folderId });
			fetchFolder(folderId);
		}
		
		return () => {
			logger.logComponentUnmount('FolderDetail', { folderId });
			clearCurrentFolder();
		};
	}, [folderId, fetchFolder, clearCurrentFolder, clearError]);

	const publicUrl =
		user && currentFolder?.isPublic
			? `${window.location.origin}/u/${user.username}/folder/${currentFolder.id}`
			: null;

	const handleCopyUrl = async () => {
		if (publicUrl) {
			await navigator.clipboard.writeText(publicUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
			toast.success('Public URL copied to clipboard');
		}
	};

	const handleUpdateFolder = async (data: UpdateFolderPayload) => {
		if (!currentFolder) return;
		try {
			await updateFolder(currentFolder.id, data);
			toast.success('Folder updated successfully');
			setShowEditModal(false);
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || err.message || 'Failed to update folder';
			logger.error('Failed to update folder', {
				component: 'FolderDetail',
				folderId: currentFolder.id,
				error: errorMessage,
				statusCode: err.response?.status
			});
			toast.error(errorMessage);
		}
	};

	const handleRemoveImage = async (imageId: string) => {
		logger.logUserAction('remove_image_from_folder', 'FolderDetail', { 
			imageId, 
			folderId: currentFolder?.id 
		});
		
		if (!confirm('Remove this image from the folder?')) return;
		try {
			await removeImage(imageId);
			logger.info('Image removed from folder successfully', {
				component: 'FolderDetail',
				imageId,
				folderId: currentFolder?.id
			});
			toast.success('Image removed from folder');
		} catch (err: any) {
			logger.error('Failed to remove image from folder', {
				component: 'FolderDetail',
				imageId,
				folderId: currentFolder?.id,
				error: err.message || 'Unknown error'
			});
			toast.error(err.message || 'Failed to remove image');
		}
	};

	const handleApplyBackground = (image: FolderImage) => {
		if (!image.removedBgUrl) {
			logger.warn('Background application attempted on image without removed background', {
				component: 'FolderDetail',
				imageId: image.id,
				folderId: currentFolder?.id
			});
			toast.error('This image needs background removal first');
			return;
		}
		logger.logUserAction('open_background_modal', 'FolderDetail', { 
			imageId: image.id, 
			folderId: currentFolder?.id 
		});
		setSelectedImage(image);
		setShowBackgroundModal(true);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
					<p className="text-foreground/60 mb-2">Loading folder...</p>
					{folderId && (
						<p className="text-xs text-foreground/40 font-mono">ID: {folderId}</p>
					)}
				</div>
			</div>
		);
	}

	// Show error state for any error condition or missing folder
	if (error || !currentFolder || !folderId || !isValidFolderId(folderId)) {
		return renderErrorState();
	}

	return (
		<ErrorBoundary 
			componentName="FolderDetail"
			fallback={
				<div className="min-h-screen bg-background flex items-center justify-center">
					<div className="text-center max-w-md mx-auto p-6">
						<AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
						<h2 className="text-2xl font-semibold text-foreground mb-2">Component Error</h2>
						<p className="text-foreground/60 mb-6">
							The folder detail component encountered an unexpected error. Please try refreshing the page.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<button
								onClick={() => window.location.reload()}
								className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
							>
								<RefreshCw className="w-4 h-4" />
								Refresh Page
							</button>
							<button
								onClick={() => navigate('/folders')}
								className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
							>
								View All Folders
							</button>
						</div>
					</div>
				</div>
			}
		>
			<div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				{/* Breadcrumb & Actions */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
					<div className="flex items-center gap-4">
						<button
							onClick={() => navigate('/folders')}
							className="p-2 rounded-full hover:bg-secondary transition-colors"
						>
							<ArrowLeft className="w-5 h-5 text-foreground" />
						</button>
						<div>
							<h1 className="text-2xl md:text-3xl font-semibold text-foreground">
								{currentFolder.name}
							</h1>
							{currentFolder.description && (
								<p className="text-foreground/60 text-sm mt-1">
									{currentFolder.description}
								</p>
							)}
						</div>
					</div>

					<div className="flex items-center gap-3">
						{/* Visibility Badge */}
						<span
							className={`px-3 py-1 rounded-full text-sm font-medium ${
								currentFolder.isPublic
									? 'bg-green-500/10 text-green-600 dark:text-green-400'
									: 'bg-foreground/10 text-foreground/60'
							}`}
						>
							{currentFolder.isPublic ? 'Public' : 'Private'}
						</span>

						{/* Copy URL Button */}
						{publicUrl && (
							<button
								onClick={handleCopyUrl}
								className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-full text-sm font-medium transition-colors"
							>
								{copied ? (
									<Check className="w-4 h-4 text-green-500" />
								) : (
									<Copy className="w-4 h-4" />
								)}
								{copied ? 'Copied!' : 'Copy URL'}
							</button>
						)}

						{/* Settings */}
						<button
							onClick={() => setShowEditModal(true)}
							className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
						>
							<Settings className="w-5 h-5 text-foreground" />
						</button>
					</div>
				</div>

				{/* Stats */}
				<div className="flex items-center gap-4 mb-8">
					<div className="px-4 py-2 bg-secondary rounded-xl">
						<span className="text-foreground/60 text-sm">Images:</span>{' '}
						<span className="font-semibold text-foreground">
							{currentFolder._count.images}
						</span>
					</div>
					<div className="px-4 py-2 bg-secondary rounded-xl">
						<span className="text-foreground/60 text-sm">Created:</span>{' '}
						<span className="font-semibold text-foreground">
							{new Date(currentFolder.createdAt).toLocaleDateString('en-GB', {
								day: '2-digit',
								month: 'short',
								year: 'numeric',
							})}
						</span>
					</div>
				</div>

				{/* Images Grid */}
				{currentFolder.images.length === 0 ? (
					<div className="flex items-center justify-center py-20">
						<div className="text-center">
							<ImageIcon className="w-20 h-20 text-foreground/20 mx-auto mb-4" />
							<h3 className="text-xl font-semibold text-foreground mb-2">
								No images yet
							</h3>
							<p className="text-foreground/60 mb-6">
								Add images from your gallery to this folder
							</p>
							<Link
								to="/gallery"
								className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors inline-block"
							>
								Go to Gallery
							</Link>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{currentFolder.images.map((image) => (
							<ImageCard
								key={image.id}
								image={image}
								isInFolder={true}
								onApplyBackground={() => handleApplyBackground(image)}
								onRemoveFromFolder={() => handleRemoveImage(image.id)}
								showFolderActions={true}
							/>
						))}
					</div>
				)}
			</div>

			{/* Edit Modal */}
			<CreateFolderModal
				isOpen={showEditModal}
				onClose={() => setShowEditModal(false)}
				onSubmit={handleUpdateFolder}
				folder={currentFolder}
			/>

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
					onSuccess={() => {
						// Refresh folder to get updated image
						if (folderId) fetchFolder(folderId);
					}}
				/>
			)}
		</div>
		</ErrorBoundary>
	);
};

export default FolderDetail;
