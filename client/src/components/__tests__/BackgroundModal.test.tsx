import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import BackgroundModal from '../BackgroundModal';
import { useBackgroundStore } from '@/store/backgroundStore';

// Mock the background store
vi.mock('@/store/backgroundStore');
const mockUseBackgroundStore = vi.mocked(useBackgroundStore);

// Mock the credit store
vi.mock('@/store/creditStore', () => ({
	useCreditStore: () => ({
		get: vi.fn(),
	}),
}));

// Mock the logger
vi.mock('@/utils/logger', () => ({
	logger: {
		logModalAction: vi.fn(),
		logUserAction: vi.fn(),
		debug: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
	},
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

const mockBackgrounds = [
	{
		id: 'studio-soft',
		label: 'Studio – Soft Light',
		category: 'studio' as const,
		preview: 'https://example.com/studio-soft.jpg',
	},
	{
		id: 'office-modern',
		label: 'Modern Office',
		category: 'office' as const,
		preview: 'https://example.com/office-modern.jpg',
	},
	{
		id: 'outdoor-city',
		label: 'Outdoor – City Blur',
		category: 'outdoor' as const,
		preview: 'https://example.com/outdoor-city.jpg',
	},
];

describe('BackgroundModal', () => {
	const mockProps = {
		isOpen: true,
		onClose: vi.fn(),
		imageId: 'test-image-id',
		removedBgUrl: 'https://example.com/removed-bg.jpg',
		onSuccess: vi.fn(),
	};

	const mockStoreState = {
		backgrounds: mockBackgrounds,
		loading: false,
		applying: false,
		error: null,
		fetchBackgrounds: vi.fn(),
		applyBackground: vi.fn(),
		clearError: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockUseBackgroundStore.mockReturnValue(mockStoreState);
	});

	it('renders modal when open', () => {
		render(<BackgroundModal {...mockProps} />);
		
		expect(screen.getByRole('heading', { name: 'Apply Background' })).toBeInTheDocument();
		expect(screen.getByText('Preset Backgrounds')).toBeInTheDocument();
		expect(screen.getByText('AI Generate (1 Credit)')).toBeInTheDocument();
	});

	it('does not render when closed', () => {
		render(<BackgroundModal {...mockProps} isOpen={false} />);
		
		expect(screen.queryByText('Apply Background')).not.toBeInTheDocument();
	});

	it('fetches backgrounds when modal opens with no backgrounds', async () => {
		const mockFetchBackgrounds = vi.fn();
		mockUseBackgroundStore.mockReturnValue({
			...mockStoreState,
			backgrounds: [],
			fetchBackgrounds: mockFetchBackgrounds,
		});

		render(<BackgroundModal {...mockProps} />);

		await waitFor(() => {
			expect(mockFetchBackgrounds).toHaveBeenCalled();
		});
	});

	it('displays loading state', () => {
		mockUseBackgroundStore.mockReturnValue({
			...mockStoreState,
			loading: true,
			backgrounds: [],
		});

		render(<BackgroundModal {...mockProps} />);
		
		expect(screen.getByText('Loading backgrounds...')).toBeInTheDocument();
	});

	it('displays error state with retry button', () => {
		const mockFetchBackgrounds = vi.fn();
		mockUseBackgroundStore.mockReturnValue({
			...mockStoreState,
			error: 'Failed to load backgrounds',
			backgrounds: [],
			fetchBackgrounds: mockFetchBackgrounds,
		});

		render(<BackgroundModal {...mockProps} />);
		
		expect(screen.getByText('❌ Error loading backgrounds')).toBeInTheDocument();
		expect(screen.getByText('Failed to load backgrounds')).toBeInTheDocument();
		
		const retryButton = screen.getByText('Retry Loading');
		fireEvent.click(retryButton);
		
		expect(mockFetchBackgrounds).toHaveBeenCalled();
	});

	it('displays backgrounds in grid', () => {
		render(<BackgroundModal {...mockProps} />);
		
		expect(screen.getByText('Studio – Soft Light')).toBeInTheDocument();
		expect(screen.getByText('Modern Office')).toBeInTheDocument();
		expect(screen.getByText('Outdoor – City Blur')).toBeInTheDocument();
	});

	it('filters backgrounds by category', () => {
		render(<BackgroundModal {...mockProps} />);
		
		// Click on Studio category
		const studioButton = screen.getByText('Studio (1)');
		fireEvent.click(studioButton);
		
		// Should only show studio backgrounds
		expect(screen.getByText('Studio – Soft Light')).toBeInTheDocument();
		expect(screen.queryByText('Modern Office')).not.toBeInTheDocument();
		expect(screen.queryByText('Outdoor – City Blur')).not.toBeInTheDocument();
	});

	it('shows category counts correctly', () => {
		render(<BackgroundModal {...mockProps} />);
		
		expect(screen.getByText('All (3)')).toBeInTheDocument();
		expect(screen.getByText('Studio (1)')).toBeInTheDocument();
		expect(screen.getByText('Office (1)')).toBeInTheDocument();
		expect(screen.getByText('Outdoor (1)')).toBeInTheDocument();
		expect(screen.getByText('Abstract (0)')).toBeInTheDocument();
	});

	it('allows background selection', () => {
		render(<BackgroundModal {...mockProps} />);
		
		const backgroundButton = screen.getByRole('button', { name: /Studio – Soft Light/i });
		fireEvent.click(backgroundButton);
		
		// Check if the background is selected (should have checkmark)
		expect(backgroundButton).toHaveClass('border-blue-600');
	});

	it('disables apply button when no background selected', () => {
		render(<BackgroundModal {...mockProps} />);
		
		const applyButton = screen.getByRole('button', { name: 'Apply Background' });
		expect(applyButton).toBeDisabled();
	});

	it('enables apply button when background selected', () => {
		render(<BackgroundModal {...mockProps} />);
		
		// Select a background
		const backgroundButton = screen.getByRole('button', { name: /Studio – Soft Light/i });
		fireEvent.click(backgroundButton);
		
		const applyButton = screen.getByRole('button', { name: 'Apply Background' });
		expect(applyButton).not.toBeDisabled();
	});

	it('calls onClose when cancel button clicked', () => {
		const mockOnClose = vi.fn();
		render(<BackgroundModal {...mockProps} onClose={mockOnClose} />);
		
		const cancelButton = screen.getByText('Cancel');
		fireEvent.click(cancelButton);
		
		expect(mockOnClose).toHaveBeenCalled();
	});

	it('calls onClose when backdrop clicked', () => {
		const mockOnClose = vi.fn();
		render(<BackgroundModal {...mockProps} onClose={mockOnClose} />);
		
		const backdrop = document.querySelector('.absolute.inset-0.bg-black\\/60');
		if (backdrop) {
			fireEvent.click(backdrop);
			expect(mockOnClose).toHaveBeenCalled();
		}
	});
});