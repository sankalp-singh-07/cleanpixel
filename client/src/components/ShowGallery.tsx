import { useEffect, useState } from 'react';
import { useGalleryStore } from '@/store/galleryStore';

const ShowGallery = () => {
	const { images, loading, error, fetchGallery, sort, page, limit, hasMore } =
		useGalleryStore();

	const [imageModes, setImageModes] = useState<{
		[id: string]: 'original' | 'removed';
	}>({});

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

	const toggleImageMode = (id: string) => {
		setImageModes((prev) => ({
			...prev,
			[id]: prev[id] === 'removed' ? 'original' : 'removed',
		}));
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
				<div className="text-center text-foreground/60">
					No images found.
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
						collection
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
					{images.map((img) => {
						const currentMode = imageModes[img.id] || 'original';
						const isShowingRemoved =
							currentMode === 'removed' && !!img.removedBgUrl;
						const imageSrc: string =
							(isShowingRemoved && img.removedBgUrl
								? img.removedBgUrl
								: img.originalUrl) ?? '/placeholder-image.png';

						return (
							<div
								key={img.id}
								className="group relative bg-secondary rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-border"
							>
								<div className="aspect-[3/4] overflow-hidden">
									<img
										src={imageSrc}
										alt="gallery"
										onError={(e) =>
											(e.currentTarget.src =
												'/placeholder-image.png')
										}
										className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
									/>
								</div>

								<div className="absolute inset-0 bg-gradient-to-t from-accent/70 via-accent/0 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

								<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-accent/80 to-transparent p-4">
									<div className="flex justify-between items-center text-white text-sm">
										<span className="text-xs font-semibold bg-primary rounded-full px-2 py-1">
											{new Date(
												img.createdAt
											).toLocaleDateString('en-GB', {
												day: '2-digit',
												month: 'short',
												year: 'numeric',
											})}
										</span>
										<span className="px-3 py-1 bg-primary backdrop-blur-sm rounded-full text-xs font-semibold">
											{isShowingRemoved
												? 'Edited'
												: 'Original'}
										</span>
									</div>
								</div>

								<div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									{img.removedBgUrl && (
										<button
											onClick={() =>
												toggleImageMode(img.id)
											}
											className="bg-white/95 backdrop-blur-sm hover:bg-white text-accent rounded-full px-4 py-2 text-xs font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
										>
											{isShowingRemoved
												? '👁️ Original'
												: '✨ Edited'}
										</button>
									)}
									<a
										href={imageSrc}
										download
										className="bg-white/95 backdrop-blur-sm hover:bg-white text-accent rounded-full w-9 h-9 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
									>
										⬇️
									</a>
								</div>
							</div>
						);
					})}
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
		</div>
	);
};

export default ShowGallery;
