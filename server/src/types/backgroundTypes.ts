import { z } from 'zod';

export const ApplyBackgroundSchema = z.object({
	mode: z.enum(['preset', 'generate']),
	backgroundId: z.string().optional(),
	prompt: z.string().max(250, 'Prompt too long').optional(),
});

export type ApplyBackgroundBody = z.infer<typeof ApplyBackgroundSchema>;
