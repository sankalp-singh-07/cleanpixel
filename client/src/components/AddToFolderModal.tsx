import { useEffect, useState } from 'react';
import { X, Folder, Plus, Loader2, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useFolderStore } from '@/store/folderStore';
import type { Folder as FolderType } from '@/types/folderTypes';
import { logger } from '@/utils/logger';

type Props = {
	isOpen: boolean;
	onClose: () => void;
	imageId: string;
	onCreateFolder: () => void;
};

const AddToFolderModal = ({ isOpen, onClose, imageId, onCreateFolder }: Props) => {
	const { 
		folders, 
		loading, 
		assignmentLoading,
		fetchFolders, 
		assignImage, 
		error, 
		assignmentError,
		clearError,
		clearAssignmentError
	} = useFolderStore();
	const [assigningToFolder, setAssigningToFolder] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [retryCount, setRetryCount] = useState(0);

	// Clear success message and errors when modal opens
	useEffect(() => {
		if (isOpen) {
			setSuccessMessage(null);
			setAssigningToFolder(null);
			setRetryCount(0);
			clearError();
			clearAssignmentError();
			
			logger.logModalAction('AddToFolderModal', 'OPEN', { 
				imageId, 
				foldersLoaded: folders.length > 0,
				folderCount: folders.length
			});
			
			// Always fetch folders when modal opens to ensure fresh data
			fetchFolders();
		}
	}, [isOpen, imageId, clearError, clearAssignmentError, fetchFolders]);

	// Clear success message after 3 seconds
	useEffect(() => {
		if (successMessage) {
			const timer = setTimeout(() => {
				setSuccessMessage(null);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [successMessage]);

	const handleAssign = async (folder: FolderType) => {
		if (assigningToFolder || assignmentLoading) return; // Prevent double-clicks
		
		setAssigningToFolder(folder.id);
		setSuccessMessage(null);
		clearError();
		clearAssignmentError();
		
		logger.logUserAction('assign_image_to_folder', 'AddToFolderModal', { 
			imageId, 
			folderId: folder.id,
			folderName: folder.name,
			retryCount
		});
		
		try {
			// Use enhanced assignment with retry logic and timeout
			await assignImage(imageId, folder.id, {
				retries: 2, // Allow 2 retries (3 total attempts)
				timeout: 8000 // 8 second timeout
			});
			
			logger.info('Image assignment successful', { 
				component: 'AddToFolderModal',
				imageId, 
				folderId: folder.id,
				folderName: folder.name,
				retryCount
			});
			
			setSuccessMessage(`Image added to "${folder.name}" successfully!`);
			setAssigningToFolder(null);
			
			// Close modal after showing success message briefly
			setTimeout(() => {
				onClose();
			}, 1500);
			
		} catch (err) {
			setAssigningToFolder(null);
			setRetryCount(prev => prev + 1);
			
			logger.error('Image assignment failed in modal', { 
				component: 'AddToFolderModal',
				imageId, 
				folderId: folder.id,
				folderName: folder.name,
				error: err instanceof Error ? err.message : 'Unknown error',
				retryCount: retryCount + 1
			});
			
			// Error is handled in store, but we can provide additional context
		}
	};

	const handleRetry = () => {
		clearError();
		clearAssignmentError();
		setRetryCount(0);
		fetchFolders();
	};

	const handleClose = () => {
		setSuccessMessage(null);
		setAssigningToFolder(null);
		setRetryCount(0);
		clearError();
		clearAssignmentError();
		onClose();
	};

	if (!isOpen) return null;

	// Log modal render state
	logger.debug('AddToFolderModal render', {
		component: 'AddToFolderModal',
		isOpen,
		loading,
		assignmentLoading,
		folderCount: folders.length,
		hasError: !!(error || assignmentError),
		imageId,
		assigningToFolder,
		hasSuccessMessage: !!successMessage,
		retryCount
	});

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

			<div className="relative z-10 w-full max-w-md m-4 bg-background rounded-2xl shadow-2xl">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-border">
					<h2 className="text-xl font-semibold text-foreground">Add to Folder</h2>
					<button
						onClick={handleClose}
						className="p-2 rounded-full hover:bg-secondary transition-colors"
						disabled={!!assigningToFolder || assignmentLoading}
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Success Message */}
				{successMessage && (
					<div className="p-4 bg-green-50 border-b border-green-200">
						<div className="flex items-center gap-2 text-green-800">
							<CheckCircle className="w-5 h-5" />
							<span className="text-sm font-medium">{successMessage}</span>
						</div>
					</div>
				)}

				{/* Error Message with Retry */}
				{(error || assignmentError) && !successMessage && (
					<div className="p-4 bg-red-50 border-b border-red-200">
						<div className="flex items-start gap-2 text-red-800">
							<AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
							<div className="flex-1">
								<p className="text-sm font-medium mb-2">{assignmentError || error}</p>
								<button
									onClick={handleRetry}
									className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 rounded-md text-xs font-medium transition-colors"
									disabled={loading || assignmentLoading}
								>
									<RefreshCw className={`w-3 h-3 ${(loading || assignmentLoading) ? 'animate-spin' : ''}`} />
									{(loading || assignmentLoading) ? 'Retrying...' : 'Retry'}
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Content */}
				<div className="p-4 max-h-96 overflow-y-auto">
					{(loading || assignmentLoading) ? (
						<div className="flex items-center justify-center py-8">
							<div className="flex flex-col items-center gap-3">
								<Loader2 className="w-8 h-8 animate-spin text-primary" />
								<p className="text-sm text-foreground/60">
									{assignmentLoading ? 'Assigning image...' : 
									 retryCount > 0 ? 'Retrying...' : 'Loading folders...'}
								</p>
							</div>
						</div>
					) : folders.length === 0 ? (
						<div className="text-center py-8">
							<Folder className="w-12 h-12 text-foreground/30 mx-auto mb-3" />
							<p className="text-foreground/60 mb-4">No folders yet</p>
							<button
								onClick={() => {
									handleClose();
									onCreateFolder();
								}}
								className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
								disabled={!!assigningToFolder || assignmentLoading}
							>
								Create First Folder
							</button>
						</div>
					) : (
						<div className="space-y-2">
							{/* Create New Folder Option */}
							<button
								onClick={() => {
									handleClose();
									onCreateFolder();
								}}
								className="w-full p-3 flex items-center gap-3 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 transition-colors"
								disabled={!!assigningToFolder || assignmentLoading}
							>
								<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
									<Plus className="w-5 h-5 text-primary" />
								</div>
								<span className="font-medium text-primary">Create New Folder</span>
							</button>

							{/* Existing Folders */}
							{folders.map((folder) => {
								const isAssigning = assigningToFolder === folder.id;
								return (
									<button
										key={folder.id}
										onClick={() => handleAssign(folder)}
										className="w-full p-3 flex items-center gap-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
										disabled={!!assigningToFolder || assignmentLoading}
									>
										<div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center overflow-hidden">
											{folder.thumbnailUrl ? (
												<img
													src={folder.thumbnailUrl}
													alt={folder.name}
													className="w-full h-full object-cover"
												/>
											) : (
												<Folder className="w-5 h-5 text-primary/50" />
											)}
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-medium text-foreground truncate">
												{folder.name}
											</p>
											<p className="text-xs text-foreground/50">
												{folder.isPublic ? 'Public' : 'Private'}
											</p>
										</div>
										{isAssigning && (
											<Loader2 className="w-5 h-5 animate-spin text-primary" />
										)}
									</button>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AddToFolderModal;
