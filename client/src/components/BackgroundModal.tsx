import { useEffect, useState } from 'react';
import { X, Wand2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useBackgroundStore } from '@/store/backgroundStore';
import { useCreditStore } from '@/store/creditStore';
import { toast } from 'react-toastify';
import { logger } from '@/utils/logger';

type Props = {
	isOpen: boolean;
	onClose: () => void;
	imageId: string;
	removedBgUrl: string;
	onSuccess?: (finalUrl: string) => void;
};

const categories = [
	{ id: 'all', label: 'All' },
	{ id: 'studio', label: 'Studio' },
	{ id: 'office', label: 'Office' },
	{ id: 'outdoor', label: 'Outdoor' },
	{ id: 'abstract', label: 'Abstract' },
];

const BackgroundModal = ({ isOpen, onClose, imageId, removedBgUrl, onSuccess }: Props) => {
	const { backgrounds, loading, applying, fetchBackgrounds, applyBackground, error, clearError } =
		useBackgroundStore();
	const { get: refreshCredits } = useCreditStore();

	const [activeTab, setActiveTab] = useState<'preset' | 'generate'>('preset');
	const [selectedBg, setSelectedBg] = useState<string | null>(null);
	const [categoryFilter, setCategoryFilter] = useState('all');
	const [prompt, setPrompt] = useState('');
	const [previewUrl, setPreviewUrl] = useState(removedBgUrl);

	useEffect(() => {
		if (isOpen) {
			if (backgrounds.length === 0 && !loading && !error) {
				logger.logModalAction('BackgroundModal', 'OPEN', { 
					imageId, 
					backgroundsLoaded: false 
				});
				fetchBackgrounds();
			} else {
				logger.logModalAction('BackgroundModal', 'OPEN', { 
					imageId, 
					backgroundsLoaded: true,
					backgroundCount: backgrounds.length 
				});
			}
		}
	}, [isOpen, backgrounds.length, loading, error, fetchBackgrounds, imageId]);

	useEffect(() => {
		setPreviewUrl(removedBgUrl);
		setSelectedBg(null);
		setPrompt('');
		clearError();
		
		if (isOpen) {
			logger.debug('BackgroundModal state reset', {
				component: 'BackgroundModal',
				imageId,
				removedBgUrl: !!removedBgUrl
			});
		}
	}, [isOpen, removedBgUrl, clearError]);

	const filteredBackgrounds =
		categoryFilter === 'all'
			? backgrounds
			: backgrounds.filter((bg) => bg.category === categoryFilter);

	const handleApply = async () => {
		logger.logUserAction('apply_background', 'BackgroundModal', { 
			imageId, 
			mode: activeTab,
			selectedBg: activeTab === 'preset' ? selectedBg : null,
			hasPrompt: activeTab === 'generate' && !!prompt.trim()
		});
		
		try {
			let result;
			if (activeTab === 'preset') {
				if (!selectedBg) {
					logger.warn('Background application attempted without selection', {
						component: 'BackgroundModal',
						imageId,
						mode: 'preset'
					});
					toast.error('Please select a background');
					return;
				}
				result = await applyBackground(imageId, { mode: 'preset', backgroundId: selectedBg });
			} else {
				if (!prompt.trim()) {
					logger.warn('Background generation attempted without prompt', {
						component: 'BackgroundModal',
						imageId,
						mode: 'generate'
					});
					toast.error('Please enter a prompt');
					return;
				}
				result = await applyBackground(imageId, { mode: 'generate', prompt: prompt.trim() });
			}

			logger.info('Background application successful', {
				component: 'BackgroundModal',
				imageId,
				mode: activeTab,
				selectedBg: activeTab === 'preset' ? selectedBg : null,
				creditsUsed: result.creditsDeducted,
				finalUrl: !!result.finalUrl
			});

			toast.success(
				result.creditsDeducted > 0
					? `Background applied! (${result.creditsDeducted} credit used)`
					: 'Background applied!'
			);
			setPreviewUrl(result.finalUrl);
			refreshCredits();
			onSuccess?.(result.finalUrl);
			onClose();
		} catch (err: any) {
			logger.error('Background application failed', {
				component: 'BackgroundModal',
				imageId,
				mode: activeTab,
				selectedBg: activeTab === 'preset' ? selectedBg : null,
				error: err.message || 'Unknown error'
			});
			toast.error(err.message || 'Failed to apply background');
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

			<div className="relative z-10 w-full max-w-5xl max-h-[90vh] m-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white">Apply Background</h2>
					<button
						onClick={onClose}
						className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="flex-1 flex overflow-hidden">
					{/* Preview Panel */}
					<div className="w-1/3 p-4 border-r border-gray-200 dark:border-gray-700 flex flex-col">
						<h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Preview</h3>
						<div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center">
							<img
								src={previewUrl}
								alt="Preview"
								className="max-w-full max-h-full object-contain"
							/>
						</div>
					</div>

					{/* Selection Panel */}
					<div className="flex-1 flex flex-col overflow-hidden">
						{/* Tabs */}
						<div className="flex border-b border-gray-200 dark:border-gray-700">
							<button
								onClick={() => setActiveTab('preset')}
								className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
									activeTab === 'preset'
										? 'text-blue-600 border-b-2 border-blue-600'
										: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
								}`}
							>
								<ImageIcon className="w-4 h-4" />
								Preset Backgrounds
							</button>
							<button
								onClick={() => setActiveTab('generate')}
								className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
									activeTab === 'generate'
										? 'text-blue-600 border-b-2 border-blue-600'
										: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
								}`}
							>
								<Wand2 className="w-4 h-4" />
								AI Generate (1 Credit)
							</button>
						</div>

						{/* Content */}
						<div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-800">
							{activeTab === 'preset' ? (
								<>
									{/* Category Filter */}
									<div className="flex gap-2 mb-4 flex-wrap">
										{categories.map((cat) => {
											const count = cat.id === 'all' 
												? backgrounds.length 
												: backgrounds.filter(bg => bg.category === cat.id).length;
											
											return (
												<button
													key={cat.id}
													onClick={() => setCategoryFilter(cat.id)}
													className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
														categoryFilter === cat.id
															? 'bg-blue-600 text-white'
															: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
													}`}
												>
													{cat.label} ({count})
												</button>
											);
										})}
									</div>

									{/* Background Grid */}
									{loading ? (
										<div className="flex flex-col items-center justify-center py-12">
											<Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
											<p className="text-sm text-gray-600 dark:text-gray-400">Loading backgrounds...</p>
										</div>
									) : error ? (
										<div className="flex flex-col items-center justify-center py-12 text-center">
											<div className="text-red-500 mb-2">❌ Error loading backgrounds</div>
											<div className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</div>
											<button
												onClick={() => fetchBackgrounds()}
												className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
											>
												Retry Loading
											</button>
										</div>
									) : filteredBackgrounds.length === 0 ? (
										<div className="flex flex-col items-center justify-center py-12 text-center">
											<div className="text-gray-600 dark:text-gray-400 mb-2">
												{categoryFilter === 'all' ? 'No backgrounds available' : 'No backgrounds found'}
											</div>
											<div className="text-sm text-gray-500 dark:text-gray-500">
												{categoryFilter === 'all' 
													? `Total backgrounds loaded: ${backgrounds.length}` 
													: `No backgrounds in "${categoryFilter}" category`
												}
											</div>
											{categoryFilter !== 'all' && (
												<button
													onClick={() => setCategoryFilter('all')}
													className="mt-2 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
												>
													Show All Categories
												</button>
											)}
										</div>
									) : (
										<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
											{filteredBackgrounds.map((bg) => (
												<button
													key={bg.id}
													onClick={() => setSelectedBg(bg.id)}
													className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${
														selectedBg === bg.id
															? 'border-blue-600 ring-2 ring-blue-600/30'
															: 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
													}`}
												>
													<img
														src={bg.preview}
														alt={bg.label}
														className="w-full h-full object-cover"
														onError={(e) => {
															e.currentTarget.style.opacity = '0.5';
														}}
													/>
													<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
														<span className="text-white text-xs font-medium">
															{bg.label}
														</span>
													</div>
													{selectedBg === bg.id && (
														<div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
															<svg
																className="w-3 h-3 text-white"
																fill="currentColor"
																viewBox="0 0 20 20"
															>
																<path
																	fillRule="evenodd"
																	d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																	clipRule="evenodd"
																/>
															</svg>
														</div>
													)}
												</button>
											))}
										</div>
									)}
								</>
							) : (
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Describe your background
										</label>
										<textarea
											value={prompt}
											onChange={(e) => setPrompt(e.target.value)}
											placeholder="e.g., modern office with large windows, tropical beach at sunset, cozy coffee shop..."
											className="w-full h-32 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
											maxLength={250}
										/>
										<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
											{prompt.length}/250 characters
										</p>
									</div>

									<div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
										<h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
											<Wand2 className="w-4 h-4 text-blue-600" />
											Tips for best results
										</h4>
										<ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
											<li>• Be specific about the setting and mood</li>
											<li>• Include lighting details (soft, bright, dramatic)</li>
											<li>• Mention colors or atmosphere you want</li>
										</ul>
									</div>
								</div>
							)}
						</div>

						{/* Footer */}
						<div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
							<button
								onClick={onClose}
								className="px-6 py-2.5 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleApply}
								disabled={applying || (activeTab === 'preset' && !selectedBg) || (activeTab === 'generate' && !prompt.trim())}
								className="px-6 py-2.5 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
							>
								{applying ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin" />
										Applying...
									</>
								) : (
									'Apply Background'
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BackgroundModal;
