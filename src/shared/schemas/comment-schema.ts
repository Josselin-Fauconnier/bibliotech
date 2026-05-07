import { z } from 'zod';

export const CommentSchema = z.object({
  book_id: z.string().min(1),
  content: z.string().min(10).max(750),
});

export type CommentInput = z.infer<typeof CommentSchema>;
