import { useState } from 'react';
import AddToFolderModal from '@/components/AddToFolderModal';

const TestAddToFolderModal = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [testImageId] = useState('test-image-123');

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleCreateFolder = () => {
		console.log('Create folder clicked');
		// In real app, this would open CreateFolderModal
	};

	return (
		<div className="min-h-screen bg-background p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold text-foreground mb-8">
					AddToFolderModal Test Page
				</h1>
				
				<div className="space-y-6">
					<div className="bg-card p-6 rounded-lg border">
						<h2 className="text-xl font-semibold mb-4">Modal Test</h2>
						<p className="text-foreground/70 mb-4">
							Click the button below to test the improved AddToFolderModal with:
						</p>
						<ul className="list-disc list-inside text-foreground/70 mb-4 space-y-1">
							<li>Enhanced error handling with retry functionality</li>
							<li>Loading states during folder fetching and assignment</li>
							<li>Success feedback with auto-close</li>
							<li>Prevention of double-clicks during assignment</li>
							<li>Fresh folder data on each modal open</li>
							<li>Improved UI feedback and state management</li>
						</ul>
						
						<button
							onClick={handleOpenModal}
							className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
						>
							Open Add to Folder Modal
						</button>
					</div>

					<div className="bg-card p-6 rounded-lg border">
						<h2 className="text-xl font-semibold mb-4">Expected Improvements</h2>
						<div className="grid md:grid-cols-2 gap-4">
							<div>
								<h3 className="font-medium text-foreground mb-2">✅ Fixed Issues:</h3>
								<ul className="text-sm text-foreground/70 space-y-1">
									<li>• Folders now refresh on every modal open</li>
									<li>• Assignment shows loading spinner</li>
									<li>• Success message displays before auto-close</li>
									<li>• Error messages include retry button</li>
									<li>• Double-click prevention during assignment</li>
									<li>• UI elements disabled during operations</li>
									<li>• Better error state management</li>
								</ul>
							</div>
							<div>
								<h3 className="font-medium text-foreground mb-2">🔧 Enhanced UX:</h3>
								<ul className="text-sm text-foreground/70 space-y-1">
									<li>• Clear visual feedback for all states</li>
									<li>• Retry mechanism for failed operations</li>
									<li>• Automatic error clearing on modal open</li>
									<li>• Success confirmation before closing</li>
									<li>• Loading indicators with context</li>
									<li>• Disabled states prevent user confusion</li>
									<li>• Comprehensive logging for debugging</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="bg-card p-6 rounded-lg border">
						<h2 className="text-xl font-semibold mb-4">Test Scenarios</h2>
						<div className="text-sm text-foreground/70 space-y-2">
							<p><strong>1. Normal Flow:</strong> Open modal → Select folder → See success message → Modal closes</p>
							<p><strong>2. Error Handling:</strong> If assignment fails → Error message with retry button appears</p>
							<p><strong>3. Loading States:</strong> Loading spinner shows during folder fetch and assignment</p>
							<p><strong>4. Empty State:</strong> If no folders exist → "Create First Folder" option appears</p>
							<p><strong>5. Double-Click Prevention:</strong> Clicking folder multiple times only triggers one assignment</p>
						</div>
					</div>
				</div>
			</div>

			{/* Test Modal */}
			<AddToFolderModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				imageId={testImageId}
				onCreateFolder={handleCreateFolder}
			/>
		</div>
	);
};

export default TestAddToFolderModal;