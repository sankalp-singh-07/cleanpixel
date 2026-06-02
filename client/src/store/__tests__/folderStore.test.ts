import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useFolderStore } from '../folderStore';
import * as folderApi from '@/api/folder';
import type { FolderImage, FolderWithImages } from '@/types/folderTypes';

// Mock the folder API
vi.mock('@/api/folder');
const mockFolderApi = vi.mocked(folderApi);

// Mock the logger
vi.mock('@/utils/logger', () => ({
  logger: {
    logStoreAction: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('FolderStore Assignment Logic', () => {
  const createMockImage = (overrides: Partial<FolderImage> = {}): FolderImage => ({
    id: 'image-123',
    userId: 'user-123',
    folderId: 'folder-456',
    originalUrl: 'test.jpg',
    removedBgUrl: null,
    replacedUrl: null,
    isPublic: false,
    type: null,
    createdAt: '2024-01-01T00:00:00Z',
    ...overrides,
  });

  const createMockFolder = (overrides: Partial<FolderWithImages> = {}): FolderWithImages => ({
    id: 'folder-456',
    userId: 'user-123',
    name: 'Test Folder',
    description: null,
    isPublic: false,
    thumbnailUrl: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    images: [],
    _count: { images: 0 },
    ...overrides,
  });

  beforeEach(() => {
    // Reset the store state before each test
    useFolderStore.setState({
      folders: [],
      currentFolder: null,
      loading: false,
      assignmentLoading: false,
      error: null,
      assignmentError: null,
    });
    
    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('assignImage', () => {
    it('should successfully assign image to folder', async () => {
      const mockUpdatedImage = createMockImage();

      mockFolderApi.assignImageToFolder.mockResolvedValueOnce(mockUpdatedImage);
      mockFolderApi.getFolders.mockResolvedValueOnce([]);

      const { assignImage } = useFolderStore.getState();

      await assignImage('image-123', 'folder-456');

      expect(mockFolderApi.assignImageToFolder).toHaveBeenCalledWith({
        imageId: 'image-123',
        folderId: 'folder-456',
      });

      const state = useFolderStore.getState();
      expect(state.assignmentLoading).toBe(false);
      expect(state.assignmentError).toBe(null);
    });

    it('should handle assignment errors with proper error messages', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Image not found' },
        },
      };

      mockFolderApi.assignImageToFolder.mockRejectedValue(mockError);

      const { assignImage } = useFolderStore.getState();

      await expect(assignImage('image-123', 'folder-456')).rejects.toThrow();

      const state = useFolderStore.getState();
      expect(state.assignmentLoading).toBe(false);
      expect(state.assignmentError).toBe('Image or folder not found - it may have been deleted');
    });

    it('should retry on network errors', async () => {
      const networkError = {
        code: 'NETWORK_ERROR',
        message: 'Network Error',
      };

      const mockUpdatedImage = createMockImage();

      // First call fails, second succeeds
      mockFolderApi.assignImageToFolder
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce(mockUpdatedImage);
      
      mockFolderApi.getFolders.mockResolvedValue([]);

      const { assignImage } = useFolderStore.getState();

      await assignImage('image-123', 'folder-456', { retries: 1 });

      // Should have been called twice (initial + 1 retry)
      expect(mockFolderApi.assignImageToFolder).toHaveBeenCalledTimes(2);

      const state = useFolderStore.getState();
      expect(state.assignmentLoading).toBe(false);
      expect(state.assignmentError).toBe(null);
    });

    it('should handle timeout errors', async () => {
      vi.useFakeTimers();

      // Mock a slow API call
      mockFolderApi.assignImageToFolder.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 15000))
      );

      const { assignImage } = useFolderStore.getState();

      const assignmentPromise = assignImage('image-123', 'folder-456', { 
        timeout: 1000,
        retries: 0 
      });

      // Fast-forward time to trigger timeout
      vi.advanceTimersByTime(1000);

      await expect(assignmentPromise).rejects.toThrow('Assignment request timed out');

      const state = useFolderStore.getState();
      expect(state.assignmentError).toContain('timed out');

      vi.useRealTimers();
    });

    it('should update current folder when assigning to viewed folder', async () => {
      const mockFolder = createMockFolder();
      const mockUpdatedImage = createMockImage();

      // Set current folder
      useFolderStore.setState({ currentFolder: mockFolder });

      mockFolderApi.assignImageToFolder.mockResolvedValueOnce(mockUpdatedImage);
      mockFolderApi.getFolder.mockResolvedValueOnce({
        ...mockFolder,
        images: [mockUpdatedImage],
        _count: { images: 1 },
      });
      mockFolderApi.getFolders.mockResolvedValueOnce([]);

      const { assignImage } = useFolderStore.getState();

      await assignImage('image-123', 'folder-456');

      expect(mockFolderApi.getFolder).toHaveBeenCalledWith('folder-456');
      expect(mockFolderApi.getFolders).toHaveBeenCalled();
    });

    it('should set loading states correctly during assignment', async () => {
      let resolveAssignment: (value: FolderImage) => void;
      const assignmentPromise = new Promise<FolderImage>((resolve) => {
        resolveAssignment = resolve;
      });

      mockFolderApi.assignImageToFolder.mockReturnValue(assignmentPromise);

      const { assignImage } = useFolderStore.getState();

      const assignPromise = assignImage('image-123', 'folder-456');

      // Check loading state is set
      expect(useFolderStore.getState().assignmentLoading).toBe(true);

      // Resolve the assignment
      const mockUpdatedImage = createMockImage();
      resolveAssignment!(mockUpdatedImage);

      mockFolderApi.getFolders.mockResolvedValueOnce([]);

      await assignPromise;

      // Check loading state is cleared
      expect(useFolderStore.getState().assignmentLoading).toBe(false);
    });
  });

  describe('clearAssignmentError', () => {
    it('should clear assignment error', () => {
      useFolderStore.setState({ assignmentError: 'Test error' });

      const { clearAssignmentError } = useFolderStore.getState();
      clearAssignmentError();

      expect(useFolderStore.getState().assignmentError).toBe(null);
    });
  });
});