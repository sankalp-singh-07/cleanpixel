import { Response } from 'express';

export class ApiError extends Error {
	constructor(
		public statusCode: number,
		message: string
	) {
		super(message);
		this.name = 'ApiError';
	}
}

/**
 * Maps common error messages to HTTP status codes
 */
const errorStatusMap: Record<string, number> = {
	'Not found': 404,
	'User not found': 404,
	'Image not found': 404,
	'Folder not found': 404,
	'Profile not found': 404,
	'Background not found': 404,
	Unauthorized: 401,
	'No user found': 401,
	'Not authorized': 403,
	'Profile is private': 403,
	'Folder is private': 403,
	'Folder does not belong to user': 403,
	'Unauthorized user': 403,
	'Insufficient credits': 402,
	Invalid: 400,
	'Wrong id': 400,
	'Invalid ID format': 400,
	'Missing params': 400,
};

/**
 * Handles controller errors with consistent response format
 * @param res Express Response object
 * @param err Error to handle
 * @param fallbackMessage Default message if error message is not recognized
 */
export const handleControllerError = (
	res: Response,
	err: unknown,
	fallbackMessage = 'Server error'
) => {
	const error = err as Error;
	const message = error?.message || fallbackMessage;

	// Check if it's an ApiError with explicit status code
	if (err instanceof ApiError) {
		return res.status(err.statusCode).json({
			success: false,
			message: err.message,
		});
	}

	// Find matching status code from error message
	const status =
		Object.entries(errorStatusMap).find(([key]) =>
			message.toLowerCase().includes(key.toLowerCase())
		)?.[1] ?? 500;

	return res.status(status).json({
		success: false,
		message,
	});
};

/**
 * Creates a standardized success response
 */
export const successResponse = <T>(
	res: Response,
	data: T,
	message?: string,
	statusCode = 200
) => {
	return res.status(statusCode).json({
		success: true,
		...(message && { message }),
		data,
	});
};

/**
 * Creates a standardized error response
 */
export const errorResponse = (
	res: Response,
	message: string,
	statusCode = 400,
	errors?: unknown
) => {
	return res.status(statusCode).json({
		success: false,
		message,
		...(errors && { errors }),
	});
};
