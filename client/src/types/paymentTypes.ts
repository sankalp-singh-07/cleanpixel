export type PlanType = {
	credits: number;
	amount: number;
	name: string;
};

export const PACKAGE_MAP = {
	basic: { credits: 10, amount: 10, name: 'basic' },
	advanced: { credits: 30, amount: 20, name: 'advanced' },
	premium: { credits: 50, amount: 30, name: 'premium' },
} as const;

export type planTypes = keyof typeof PACKAGE_MAP;

export type Paymentresponse = {
	message: string;
	success: boolean;
	order: any;
	credits: 10 | 30 | 50;
};

export type validationParams = {
	razorpay_order_id: string;
	razorpay_payment_id: string;
	razorpay_signature: string;
};
