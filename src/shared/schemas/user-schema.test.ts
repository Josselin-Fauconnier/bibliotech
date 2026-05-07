import { describe, it, expect } from 'vitest';
import { RegisterSchema } from './user-schema';

describe('RegisterSchema', () => {

  it('accepte des données valides', () => {
    const result = RegisterSchema.safeParse({
      username: 'Alice',
      email: 'alice@mail.com',
      password: 'Secure123!+aq',
    });
    expect(result.success).toBe(true);
  });

  it('rejette un email invalide', () => {
    const result = RegisterSchema.safeParse({
      username: 'Alice',
      email: 'pas-un-email',
      password: 'Secure123!',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un mot de passe trop court', () => {
    const result = RegisterSchema.safeParse({
      username: 'Alice',
      email: 'alice@mail.com',
      password: 'Ab1!',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un mot de passe sans majuscule', () => {
    const result = RegisterSchema.safeParse({
      username: 'Alice',
      email: 'alice@mail.com',
      password: 'secure123!abc',
    });
    expect(result.success).toBe(false);
  });
 
  it('rejette un mot de passe sans minuscule', () => {
    const result = RegisterSchema.safeParse({
      username: 'Alice',
      email: 'alice@mail.com',
      password: 'QMS6123!XLSLKSL',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un mot de passe sans nombre', () => {
    const result = RegisterSchema.safeParse({
      username: 'Alice',
      email: 'alice@mail.com',
      password: 'secure*Zl!abc',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un mot de passe sans caractère spécial', () => {
    const result = RegisterSchema.safeParse({
      username: 'Alice',
      email: 'alice@mail.com',
      password: 'Secure123abc',
    });
    expect(result.success).toBe(false);
  });

});
