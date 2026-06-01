import { z } from 'zod';

export const CreateListSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, '100 caractères maximum'),
  description: z.string().min(10, '10 caractères minimum').max(500, '500 caractères maximum').optional(),
});
