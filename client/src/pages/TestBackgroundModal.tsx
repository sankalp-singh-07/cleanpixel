import { useState, useEffect } from 'react';
import BackgroundModal from '@/components/BackgroundModal';
import SimpleBackgroundTest from '@/components/SimpleBackgroundTest';
import { useBackgroundStore } from '@/store/backgroundStore';
import * as backgroundApi from '@/api/background';

const TestBackgroundModal = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { backgrounds, loading, error, fetchBackgrounds } = useBackgroundStore();

	// Debug: Log store state changes
	useEffect(() => {
		console.log('🔍 TestBackgroundModal: Store state changed:', {
			backgroundsCount: backgrounds.length,
			loading,
			error,
			backgrounds: backgrounds.slice(0, 2) // Log first 2 backgrounds
		});
	}, [backgrounds, loading, error]);

	const handleTestFetch = async () => {
		console.log('Testing fetchBackgrounds...');
		console.log('Current store state:', { 
			backgroundsCount: backgrounds.length, 
			loading, 
			error 
		});
		
		try {
			await fetchBackgrounds();
			console.log('Fetch completed successfully');
			console.log('New store state:', { 
				backgroundsCount: backgrounds.length, 
				loading, 
				error 
			});
		} catch (err) {
			console.error('Fetch failed:', err);
		}
	};

	const handleTestDirectAPI = async () => {
		console.log('Testing direct API call...');
		try {
			const result = await backgroundApi.getBackgrounds();
			console.log('Direct API call successful:', {
				count: result.length,
				firstItem: result[0]
			});
		} catch (err) {
			console.error('Direct API call failed:', err);
		}
	};

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-6">Background Modal Test</h1>
			
			<SimpleBackgroundTest />
			
			<div className="mt-8">
				<h2 className="text-xl font-semibold mb-4">Store State Test</h2>
			
				<div className="space-y-4 mb-8">
					<div>
						<h3 className="text-lg font-semibold mb-2">Store State:</h3>
						<div className="bg-gray-100 p-4 rounded">
							<p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
							<p><strong>Error:</strong> {error || 'none'}</p>
							<p><strong>Backgrounds Count:</strong> {backgrounds.length}</p>
							{backgrounds.length > 0 && (
								<div className="mt-2">
									<p><strong>Categories:</strong> {[...new Set(backgrounds.map(bg => bg.category))].join(', ')}</p>
									<p><strong>First Background ID:</strong> {backgrounds[0]?.id}</p>
									<p><strong>First Background Label:</strong> {backgrounds[0]?.label}</p>
								</div>
							)}
						</div>
					</div>
					
					<div className="space-x-4">
						<button
							onClick={handleTestFetch}
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
							disabled={loading}
						>
							{loading ? 'Fetching...' : 'Test Fetch Backgrounds'}
						</button>
						
						<button
							onClick={handleTestDirectAPI}
							className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
						>
							Test Direct API
						</button>
						
						<button
							onClick={() => {
								console.log('🎭 Opening BackgroundModal...');
								setIsModalOpen(true);
							}}
							className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
						>
							Open Background Modal
						</button>
						
						<button
							onClick={() => {
								console.log('🔄 Clearing store state...');
								// Reset store state for testing
								useBackgroundStore.setState({ backgrounds: [], loading: false, error: null });
							}}
							className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
						>
							Clear Store
						</button>
					</div>
				</div>

				{backgrounds.length > 0 && (
					<div>
						<h3 className="text-lg font-semibold mb-2">Loaded Backgrounds:</h3>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{backgrounds.map((bg) => (
								<div key={bg.id} className="border rounded p-2">
									<img 
										src={bg.preview} 
										alt={bg.label}
										className="w-full h-24 object-cover rounded mb-2"
										onError={(e) => {
											console.error('Image failed to load:', bg.preview);
											e.currentTarget.style.display = 'none';
										}}
									/>
									<p className="text-sm font-medium">{bg.label}</p>
									<p className="text-xs text-gray-500">{bg.category}</p>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			<BackgroundModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				imageId="test-image-id"
				removedBgUrl="https://via.placeholder.com/300x400/f0f0f0/666?text=Test+Image"
				onSuccess={(finalUrl) => {
					console.log('Background applied successfully:', finalUrl);
					setIsModalOpen(false);
				}}
			/>
		</div>
	);
};

export default TestBackgroundModal;