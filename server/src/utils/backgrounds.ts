import { ComposeOptions } from './composeBackgrounds';

export type PredefinedBackground = {
	id: string;
	label: string;
	imageUrl: string;
	category: 'studio' | 'office' | 'outdoor' | 'abstract';
	composeOptions?: ComposeOptions;
};

export const PREDEFINED_BACKGROUNDS: PredefinedBackground[] = [
	{
		id: 'studio-soft',
		label: 'Studio – Soft Light',
		imageUrl:
			'https://res.cloudinary.com/your-cloud/image/upload/v.../studio-soft.png',
		category: 'studio',
	},
	{
		id: 'studio-dark',
		label: 'Studio – Dark Gradient',
		imageUrl:
			'https://res.cloudinary.com/your-cloud/image/upload/v.../studio-dark.png',
		category: 'studio',
	},
	{
		id: 'office-modern',
		label: 'Modern Office',
		imageUrl:
			'https://res.cloudinary.com/your-cloud/image/upload/v.../office-modern.png',
		category: 'office',
	},
	{
		id: 'outdoor-city',
		label: 'Outdoor – City Blur',
		imageUrl:
			'https://res.cloudinary.com/your-cloud/image/upload/v.../outdoor-city.png',
		category: 'outdoor',
	},
];

export const getBackgroundById = (id: string) =>
	PREDEFINED_BACKGROUNDS.find((bg) => bg.id === id) || null;
