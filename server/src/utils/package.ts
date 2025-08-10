export type PlanType = {
	credits: number;
	amount: number;
	name: string;
};

export const PACKAGE_MAP = {
	basic: {
		credits: 10,
		amount: 10,
		name: 'basic',
	},
	advanced: {
		credits: 30,
		amount: 20,
		name: 'advanced',
	},
	premium: {
		credits: 50,
		amount: 30,
		name: 'premium',
	},
} as const;

export type PACKAGE_KEY = keyof typeof PACKAGE_MAP;
export type PACKAGE_MAP_TYPE = Record<PACKAGE_KEY, PlanType>;
