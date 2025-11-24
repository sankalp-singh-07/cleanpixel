import { REMOVE_BG_SECRET } from './keys';

export const removeImg = async (url: string) => {
	const formData = new FormData();
	formData.append('size', 'auto');
	formData.append('image_url', url);

	const response = await fetch('https://api.remove.bg/v1.0/removebg', {
		method: 'POST',
		headers: { 'X-Api-Key': REMOVE_BG_SECRET },
		body: formData,
	});

	if (response.ok) {
		return await response.arrayBuffer();
	} else {
		const errorText = await response.text();
		if (response.status === 402) {
			throw new Error(
				'Remove.bg API quota exceeded. Please try again later.'
			);
		}
		if (response.status === 429) {
			throw new Error('Too many requests to Remove.bg. Slow down.');
		}
		throw new Error(`Remove.bg error ${response.status}: ${errorText}`);
	}
};
