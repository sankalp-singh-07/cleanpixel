import { useEffect, useState } from 'react';
import { useBackgroundStore } from '@/store/backgroundStore';

const SimpleBackgroundTest = () => {
	const { backgrounds, loading, error, fetchBackgrounds } = useBackgroundStore();
	const [hasTriggeredFetch, setHasTriggeredFetch] = useState(false);

	useEffect(() => {
		if (!hasTriggeredFetch) {
			console.log('🔄 SimpleBackgroundTest: Triggering fetchBackgrounds...');
			fetchBackgrounds();
			setHasTriggeredFetch(true);
		}
	}, [fetchBackgrounds, hasTriggeredFetch]);

	useEffect(() => {
		console.log('🔍 SimpleBackgroundTest: Store state changed:', {
			backgroundsCount: backgrounds.length,
			loading,
			error,
			hasTriggeredFetch
		});
	}, [backgrounds, loading, error, hasTriggeredFetch]);

	return (
		<div className="p-4 border rounded-lg">
			<h3 className="text-lg font-semibold mb-4">Simple Background Test</h3>
			
			<div className="space-y-2 mb-4">
				<p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
				<p><strong>Error:</strong> {error || 'None'}</p>
				<p><strong>Backgrounds Count:</strong> {backgrounds.length}</p>
				<p><strong>Has Triggered Fetch:</strong> {hasTriggeredFetch ? 'Yes' : 'No'}</p>
			</div>

			{backgrounds.length > 0 && (
				<div>
					<h4 className="font-medium mb-2">First 3 Backgrounds:</h4>
					<div className="grid grid-cols-3 gap-2">
						{backgrounds.slice(0, 3).map((bg) => (
							<div key={bg.id} className="border rounded p-2">
								<img 
									src={bg.preview} 
									alt={bg.label}
									className="w-full h-16 object-cover rounded mb-1"
								/>
								<p className="text-xs">{bg.label}</p>
								<p className="text-xs text-gray-500">{bg.category}</p>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default SimpleBackgroundTest;