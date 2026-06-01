import { z } from 'zod';

export const CommentSchema = z.object({
  content: z.string().min(10, '10 caractères minimum').max(750, '750 caractères maximum'),
});
