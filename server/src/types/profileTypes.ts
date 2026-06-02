import { z } from 'zod';

export const ProfileUpdateSchema = z.object({
	name: z.string().min(1, 'Name cannot be empty').max(100, 'Name too long').optional(),
	bio: z.string().max(500, 'Bio too long').nullable().optional(),
	avatarUrl: z.string().url('Invalid avatar URL').nullable().optional(),
	publicProfile: z.boolean().optional(),
});

export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;
