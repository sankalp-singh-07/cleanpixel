import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';

if (
	!process.env.JWT_ACCESS_TOKEN_SECRET ||
	!process.env.JWT_REFRESH_TOKEN_SECRET ||
	!process.env.REMOVE_BG_API_KEY ||
	!process.env.RAZORPAY_KEY_ID ||
	!process.env.RAZORPAY_KEY_SECRET ||
	!process.env.CURRENCY
) {
	throw new Error('Secret keys are not defined in the environment variables');
}

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET!;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET!;

export const REMOVE_BG_SECRET = process.env.REMOVE_BG_API_KEY!;

export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;
export const CURRENCY = process.env.CURRENCY!;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
	api_key: process.env.CLOUDINARY_API_KEY!,
	api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export { cloudinary };
