import z from 'zod';

export const UserSignUp = z.object({
	name: z.string(),
	username: z.string().min(3, 'Minimum length for username is 3'),
	email: z.email(),
	password: z.string().min(6, 'Minimum length for password is 6'),
});

export const UserLogin = z.object({
	email: z.email(),
	password: z.string().min(6, 'Minimum length for password is 6'),
});
