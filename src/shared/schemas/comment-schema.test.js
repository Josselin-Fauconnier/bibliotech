import { describe, it, expect } from 'vitest';
import { CommentSchema } from './comment-schema.js';

describe('CommentSchema', () => {

  it('accepte un contenu valide', () => {
    const result = CommentSchema.safeParse({
      content: 'Un très bon livre !',
    });
    expect(result.success).toBe(true);
  });

  it('rejette un contenu vide', () => {
    const result = CommentSchema.safeParse({
      content: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un contenu trop court', () => {
    const result = CommentSchema.safeParse({
      content: 'lune',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un contenu trop long (> 750 caractères)', () => {
    const result = CommentSchema.safeParse({
      content: 'a'.repeat(751),
    });
    expect(result.success).toBe(false);
  });

});
