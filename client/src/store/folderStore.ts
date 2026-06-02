import { create } from 'zustand';
import * as folderApi from '@/api/folder';
import type { Folder, FolderWithImages, CreateFolderPayload, UpdateFolderPayload } from '@/types/folderTypes';
import { logger } from '@/utils/logger';

type FolderStore = {
	folders: Folder[];
	currentFolder: FolderWithImages | null;
	loading: boolean;
	assignmentLoading: boolean;
	error: string | null;
	assignmentError: string | null;

	// Actions
	fetchFolders: () => Promise<void>;
	fetchFolder: (folderId: string) => Promise<void>;
	createFolder: (payload: CreateFolderPayload) => Promise<Folder>;
	updateFolder: (folderId: string, payload: UpdateFolderPayload) => Promise<void>;
	deleteFolder: (folderId: string) => Promise<void>;
	assignImage: (imageId: string, folderId: string, options?: { retries?: number; timeout?: number }) => Promise<void>;
	removeImage: (imageId: string) => Promise<void>;
	clearCurrentFolder: () => void;
	clearError: () => void;
	clearAssignmentError: () => void;
};

export const useFolderStore = create<FolderStore>((set, get) => ({
	folders: [],
	currentFolder: null,
	loading: false,
	assignmentLoading: false,
	error: null,
	assignmentError: null,

	fetchFolders: async () => {
		logger.logStoreAction('folderStore', 'fetchFolders', true, { action: 'start' });
		set({ loading: true, error: null });
		try {
			const folders = await folderApi.getFolders();
			set({ folders, loading: false });
			logger.logStoreAction('folderStore', 'fetchFolders', true, { 
				folderCount: folders.length 
			});
		} catch (err: any) {
			let errorMessage = 'Failed to load folders';
			
			// Provide more specific error messages based on status code
			if (err.response?.status === 401) {
				errorMessage = 'You need to be logged in to view folders';
			} else if (err.response?.status >= 500) {
				errorMessage = 'Server error - please try again later';
			} else if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
				errorMessage = 'Network connection error - please check your internet connection';
			} else if (err.response?.data?.message) {
				errorMessage = err.response.data.message;
			} else if (err.message) {
				errorMessage = err.message;
			}
			
			set({ error: errorMessage, loading: false });
			logger.logStoreAction('folderStore', 'fetchFolders', false, { 
				error: errorMessage,
				statusCode: err.response?.status,
				errorCode: err.code
			});
		}
	},

	fetchFolder: async (folderId: string) => {
		logger.logStoreAction('folderStore', 'fetchFolder', true, { 
			action: 'start', 
			folderId 
		});
		set({ loading: true, error: null });
		try {
			const folder = await folderApi.getFolder(folderId);
			set({ currentFolder: folder, loading: false });
			logger.logStoreAction('folderStore', 'fetchFolder', true, { 
				folderId,
				folderName: folder.name,
				imageCount: folder._count?.images || 0,
				isPublic: folder.isPublic
			});
		} catch (err: any) {
			let errorMessage = 'Failed to load folder';
			
			// Provide more specific error messages based on status code
			if (err.response?.status === 404) {
				errorMessage = 'Folder not found or you don\'t have permission to view it';
			} else if (err.response?.status === 401) {
				errorMessage = 'You need to be logged in to view this folder';
			} else if (err.response?.status === 403) {
				errorMessage = 'You don\'t have permission to view this folder';
			} else if (err.response?.status >= 500) {
				errorMessage = 'Server error - please try again later';
			} else if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
				errorMessage = 'Network connection error - please check your internet connection';
			} else if (err.response?.data?.message) {
				errorMessage = err.response.data.message;
			} else if (err.message) {
				errorMessage = err.message;
			}
			
			set({ error: errorMessage, loading: false });
			logger.logStoreAction('folderStore', 'fetchFolder', false, { 
				folderId,
				error: errorMessage,
				statusCode: err.response?.status,
				errorCode: err.code
			});
		}
	},

	createFolder: async (payload: CreateFolderPayload) => {
		set({ loading: true, error: null });
		try {
			const newFolder = await folderApi.createFolder(payload);
			set((state) => ({
				folders: [newFolder, ...state.folders],
				loading: false,
			}));
			return newFolder;
		} catch (err: any) {
			set({ error: err.response?.data?.message || err.message, loading: false });
			throw err;
		}
	},

	updateFolder: async (folderId: string, payload: UpdateFolderPayload) => {
		set({ loading: true, error: null });
		try {
			const updated = await folderApi.updateFolder(folderId, payload);
			set((state) => ({
				folders: state.folders.map((f) => (f.id === folderId ? { ...f, ...updated } : f)),
				currentFolder:
					state.currentFolder?.id === folderId
						? { ...state.currentFolder, ...updated }
						: state.currentFolder,
				loading: false,
			}));
		} catch (err: any) {
			set({ error: err.response?.data?.message || err.message, loading: false });
			throw err;
		}
	},

	deleteFolder: async (folderId: string) => {
		set({ loading: true, error: null });
		try {
			await folderApi.deleteFolder(folderId);
			set((state) => ({
				folders: state.folders.filter((f) => f.id !== folderId),
				currentFolder: state.currentFolder?.id === folderId ? null : state.currentFolder,
				loading: false,
			}));
		} catch (err: any) {
			set({ error: err.response?.data?.message || err.message, loading: false });
			throw err;
		}
	},

	assignImage: async (imageId: string, folderId: string, options = {}) => {
		const { retries = 3, timeout = 10000 } = options;
		
		logger.logStoreAction('folderStore', 'assignImage', true, { 
			action: 'start', 
			imageId, 
			folderId,
			retries,
			timeout
		});
		
		set({ assignmentLoading: true, assignmentError: null });
		
		// Helper function to perform the assignment with timeout
		const performAssignment = async (): Promise<any> => {
			return Promise.race([
				folderApi.assignImageToFolder({ imageId, folderId }),
				new Promise((_, reject) => 
					setTimeout(() => reject(new Error('Assignment request timed out')), timeout)
				)
			]);
		};
		
		// Retry logic with exponential backoff
		let lastError: any = null;
		for (let attempt = 0; attempt <= retries; attempt++) {
			try {
				logger.logStoreAction('folderStore', 'assignImage', true, { 
					attempt: attempt + 1,
					maxAttempts: retries + 1,
					imageId, 
					folderId
				});
				
				const updatedImage = await performAssignment();
				
				// Update state optimistically and then sync with server
				const state = get();
				
				// Update current folder if viewing the target folder
				if (state.currentFolder?.id === folderId) {
					// Optimistically add the image to current folder
					const imageExists = state.currentFolder.images.some(img => img.id === imageId);
					if (!imageExists) {
						set((prevState) => ({
							currentFolder: prevState.currentFolder ? {
								...prevState.currentFolder,
								images: [...prevState.currentFolder.images, updatedImage],
								_count: { images: prevState.currentFolder._count.images + 1 }
							} : null
						}));
					}
					
					// Refresh folder data to ensure consistency
					try {
						await get().fetchFolder(folderId);
					} catch (refreshError) {
						logger.logStoreAction('folderStore', 'assignImage', false, { 
							warning: 'Failed to refresh folder after assignment',
							refreshError: refreshError instanceof Error ? refreshError.message : 'Unknown error',
							imageId, 
							folderId
						});
						// Don't fail the assignment if refresh fails
					}
				}
				
				// Update folders list to reflect any changes (like thumbnail updates)
				try {
					await get().fetchFolders();
				} catch (foldersRefreshError) {
					logger.logStoreAction('folderStore', 'assignImage', false, { 
						warning: 'Failed to refresh folders list after assignment',
						foldersRefreshError: foldersRefreshError instanceof Error ? foldersRefreshError.message : 'Unknown error',
						imageId, 
						folderId
					});
					// Don't fail the assignment if folders refresh fails
				}
				
				set({ assignmentLoading: false, assignmentError: null });
				
				logger.logStoreAction('folderStore', 'assignImage', true, { 
					imageId, 
					folderId,
					updatedImageId: updatedImage.id,
					attempt: attempt + 1,
					success: true
				});
				
				return; // Success, exit retry loop
				
			} catch (err: any) {
				lastError = err;
				
				// Determine if error is retryable
				const isRetryable = (
					err.code === 'NETWORK_ERROR' ||
					err.message?.includes('Network Error') ||
					err.message?.includes('timeout') ||
					err.message?.includes('timed out') ||
					(err.response?.status >= 500) ||
					err.name === 'TimeoutError'
				);
				
				// If this is the last attempt or error is not retryable, break
				if (attempt === retries || !isRetryable) {
					break;
				}
				
				// Wait before retrying (exponential backoff)
				const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
				logger.logStoreAction('folderStore', 'assignImage', false, { 
					attempt: attempt + 1,
					maxAttempts: retries + 1,
					retrying: true,
					delay,
					error: err.message || 'Unknown error',
					isRetryable,
					imageId, 
					folderId
				});
				
				await new Promise(resolve => setTimeout(resolve, delay));
			}
		}
		
		// All retries failed, handle the error
		let errorMessage = 'Failed to assign image to folder';
		
		if (lastError) {
			// Provide more specific error messages based on error type
			if (lastError.message?.includes('timeout') || lastError.message?.includes('timed out')) {
				errorMessage = 'Assignment request timed out - please check your connection and try again';
			} else if (lastError.response?.status === 401) {
				errorMessage = 'You need to be logged in to assign images to folders';
			} else if (lastError.response?.status === 403) {
				errorMessage = 'You don\'t have permission to assign this image to the folder';
			} else if (lastError.response?.status === 404) {
				errorMessage = 'Image or folder not found - it may have been deleted';
			} else if (lastError.response?.status >= 500) {
				errorMessage = 'Server error - please try again later';
			} else if (lastError.code === 'NETWORK_ERROR' || lastError.message?.includes('Network Error')) {
				errorMessage = 'Network connection error - please check your internet connection';
			} else if (lastError.response?.data?.message) {
				errorMessage = lastError.response.data.message;
			} else if (lastError.message) {
				errorMessage = lastError.message;
			}
		}
		
		set({ 
			assignmentLoading: false, 
			assignmentError: errorMessage 
		});
		
		logger.logStoreAction('folderStore', 'assignImage', false, { 
			imageId, 
			folderId,
			error: errorMessage,
			statusCode: lastError?.response?.status,
			errorCode: lastError?.code,
			totalAttempts: retries + 1,
			finalError: true
		});
		
		throw new Error(errorMessage);
	},

	removeImage: async (imageId: string) => {
		set({ error: null });
		try {
			await folderApi.removeImageFromFolder(imageId);
			// Update current folder
			set((state) => ({
				currentFolder: state.currentFolder
					? {
							...state.currentFolder,
							images: state.currentFolder.images.filter((img) => img.id !== imageId),
							_count: { images: state.currentFolder._count.images - 1 },
					  }
					: null,
			}));
		} catch (err: any) {
			set({ error: err.response?.data?.message || err.message });
			throw err;
		}
	},

	clearCurrentFolder: () => set({ currentFolder: null }),
	clearError: () => set({ error: null }),
	clearAssignmentError: () => set({ assignmentError: null }),
}));
