import dotenv from 'dotenv';
dotenv.config();

if (
	!process.env.JWT_ACCESS_TOKEN_SECRET ||
	!process.env.JWT_REFRESH_TOKEN_SECRET
) {
	throw new Error('JWT secrets are not defined in the environment variables');
}

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET!;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET!;
