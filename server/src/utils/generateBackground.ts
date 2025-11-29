const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

if (!PEXELS_API_KEY) {
	throw new Error(
		'PEXELS_API_KEY is not set. Add it to your environment variables.'
	);
}

type PexelsPhoto = {
	id: number;
	width: number;
	height: number;
	avg_color?: string | null;
	src: {
		original: string;
		large: string;
		large2x: string;
		medium: string;
		small: string;
		portrait: string;
		landscape: string;
		tiny: string;
	};
	alt: string;
};

function normalizePrompt(prompt: string): string {
	const lower = prompt.toLowerCase();

	if (lower.includes('office')) return 'modern office background';
	if (lower.includes('nature') || lower.includes('forest'))
		return 'nature background';
	if (lower.includes('city') || lower.includes('urban'))
		return 'city skyline background';
	if (lower.includes('studio')) return 'studio backdrop';
	if (lower.includes('gradient')) return 'gradient background';

	return `${prompt} background`;
}

function pickBestPhoto(photos: PexelsPhoto[]): PexelsPhoto {
	if (photos.length === 0) {
		throw new Error('No photos found from Pexels');
	}

	let best = photos[0];
	let bestScore = best.width * best.height;

	for (const photo of photos) {
		const resolutionScore = photo.width * photo.height;
		const isLandscape = photo.width >= photo.height ? 1 : 0;
		const score = resolutionScore * (1 + 0.1 * isLandscape);

		if (score > bestScore) {
			best = photo;
			bestScore = score;
		}
	}

	return best;
}

export const generateBackgroundImage = async (
	prompt: string
): Promise<string> => {
	const query = normalizePrompt(prompt);

	const url = new URL('https://api.pexels.com/v1/search');
	url.searchParams.set('query', query);
	url.searchParams.set('orientation', 'landscape');
	url.searchParams.set('per_page', '30');

	const res = await fetch(url.toString(), {
		method: 'GET',
		headers: {
			Authorization: PEXELS_API_KEY,
		},
	});

	if (!res.ok) {
		const text = await res.text();
		console.error('Pexels API error:', res.status, text);
		throw new Error(`Failed to fetch background from Pexels`);
	}

	const data = (await res.json()) as { photos: PexelsPhoto[] };

	if (!data.photos || data.photos.length === 0) {
		throw new Error('No backgrounds found for this prompt');
	}

	const bestPhoto = pickBestPhoto(data.photos);

	const backgroundUrl =
		bestPhoto.src.landscape ||
		bestPhoto.src.large2x ||
		bestPhoto.src.large ||
		bestPhoto.src.original;

	return backgroundUrl;
};
