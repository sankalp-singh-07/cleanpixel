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
			'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80',
		category: 'studio',
		composeOptions: {
			scale: 0.65,
			bgBlur: 0,
			addShadow: true,
			shadowBlur: 20,
			bottomMargin: 5,
		},
	},
	{
		id: 'studio-dark',
		label: 'Studio – Dark Gradient',
		imageUrl:
			'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80',
		category: 'studio',
		composeOptions: {
			scale: 0.65,
			bgBlur: 0,
			addShadow: true,
			shadowBlur: 25,
			bottomMargin: 5,
		},
	},
	{
		id: 'office-modern',
		label: 'Modern Office',
		imageUrl:
			'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80',
		category: 'office',
		composeOptions: {
			scale: 0.6,
			bgBlur: 3,
			addShadow: true,
			shadowBlur: 15,
			bottomMargin: 10,
		},
	},
	{
		id: 'outdoor-city',
		label: 'Outdoor – City Blur',
		imageUrl:
			'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80',
		category: 'outdoor',
		composeOptions: {
			scale: 0.55,
			bgBlur: 4,
			addShadow: true,
			shadowBlur: 18,
			bottomMargin: 8,
		},
	},
	{
		id: 'nature-forest',
		label: 'Nature – Forest',
		imageUrl:
			'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
		category: 'outdoor',
		composeOptions: {
			scale: 0.58,
			bgBlur: 2,
			addShadow: true,
			shadowBlur: 20,
			bottomMargin: 10,
		},
	},
	{
		id: 'abstract-gradient',
		label: 'Abstract – Colorful',
		imageUrl:
			'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&q=80',
		category: 'abstract',
		composeOptions: {
			scale: 0.62,
			bgBlur: 0,
			addShadow: true,
			shadowBlur: 22,
			bottomMargin: 5,
		},
	},
	{
		id: 'office-workspace',
		label: 'Home Office',
		imageUrl:
			'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&q=80',
		category: 'office',
		composeOptions: {
			scale: 0.58,
			bgBlur: 4,
			addShadow: true,
			shadowBlur: 16,
			bottomMargin: 8,
		},
	},
	{
		id: 'studio-white',
		label: 'Studio – Clean White',
		imageUrl:
			'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=1920&q=80',
		category: 'studio',
		composeOptions: {
			scale: 0.65,
			bgBlur: 0,
			addShadow: true,
			shadowBlur: 30,
			bottomMargin: 5,
		},
	},
];

export const getBackgroundById = (id: string) =>
	PREDEFINED_BACKGROUNDS.find((bg) => bg.id === id) || null;

export const getBackgroundsByCategory = (
	category: PredefinedBackground['category']
) => PREDEFINED_BACKGROUNDS.filter((bg) => bg.category === category);
