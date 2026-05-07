import {z} from 'zod';

export const CreateListSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().min(10).max(500).optional(),
});

export type CreateListInput= z.infer<typeof CreateListSchema>;