import { z } from 'zod';

export const RegisterSchema = z.object({
  username: z.string().min(2, '2 caractères minimum').max(20, '20 caractères maximum'),
  email: z.email('Adresse e-mail invalide'),
  password: z.string()
    .min(12, "12 caractères minimum")
    .regex(/[A-Z]/, "Une majuscule est requise")
    .regex(/[a-z]/, "Une minuscule est requise")
    .regex(/[0-9]/, "Un chiffre est requis")
    .regex(/[^A-Za-z0-9]/, "Un caractère spécial est requis"),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
