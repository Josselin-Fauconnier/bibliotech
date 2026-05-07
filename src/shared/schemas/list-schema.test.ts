import { describe, it, expect } from 'vitest';
import { CreateListSchema }  from './list-schema';


describe('CreateListSchema', () => {

  it('accepte des données valides avec description', () => {
    const result = CreateListSchema.safeParse({
      name: 'Ma liste',
      description: 'Mes lectures du moment .',
    });
    expect(result.success).toBe(true);
  });

  it('accepte des données valides sans description (optionnelle)', () => {
    const result = CreateListSchema.safeParse({
      name: 'Ma liste',
    });
    expect(result.success).toBe(true);
  });

  it('rejette un nom vide', () => {
    const result = CreateListSchema.safeParse({
      name: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un nom trop long (> 100 caractères)', () => {
    const result = CreateListSchema.safeParse({
      name: 'a'.repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it('rejette une description trop courte (< 10 caractères)', () => {
    const result = CreateListSchema.safeParse({
      name: 'Ma liste',
      description: 'Court',
    });
    expect(result.success).toBe(false);
  });

  it('rejette une description trop longue (> 500 caractères)', () => {
    const result = CreateListSchema.safeParse({
      name: 'Ma liste',
      description: 'a'.repeat(501),
    });
    expect(result.success).toBe(false);
  });

});
