import { z } from 'zod';

// export const loginFormSchema = z.object({});

export const signupFormSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.email(),
	password: z.string().min(6, 'Minimum length is 6'),
	username: z.string().min(1, 'Username is required'),
});

// export type loginFormSchemaType = z.infer<typeof loginFormSchema>;
export type signupFormSchemaType = z.infer<typeof signupFormSchema>;
