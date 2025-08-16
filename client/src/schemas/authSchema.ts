import { z } from 'zod';

const hasLower = /[a-z]/;
const hasUpper = /[A-Z]/;
const hasSymbol = /[^A-Za-z0-9]/;

// export const loginFormSchema = z.object({});

export const signupFormSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, 'Name must be at least 2 characters')
		.max(50, 'Name is too long'),
	email: z.email('Enter a valid email').trim(),
	username: z
		.string()
		.trim()
		.transform((v) => v.toLowerCase()),
	password: z
		.string()
		.min(6, 'At least 6 characters')
		.regex(hasLower, 'Must include a lowercase letter')
		.regex(hasUpper, 'Must include an uppercase letter')
		.regex(hasSymbol, 'Must include a symbol'),
});

// export type loginFormSchemaType = z.infer<typeof loginFormSchema>;
export type signupFormSchemaType = z.infer<typeof signupFormSchema>;
