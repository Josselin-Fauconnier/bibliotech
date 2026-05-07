import { describe, it, expect } from 'vitest';
import { CommentSchema } from './comment-schema';

describe('CommentSchema', () => {

  it('accepte des données valides', () => {
    const result = CommentSchema.safeParse({
      book_id: 'OL82563W',
      content: ' Un Très bon livre !',
    });
    expect(result.success).toBe(true);
  });

  it('rejette un book_id vide', () => {
    const result = CommentSchema.safeParse({
      book_id: '',
      content: 'Très mauvais  livre !',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un contenu vide', () => {
    const result = CommentSchema.safeParse({
      book_id: 'OL82563W',
      content: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un contenu trop court',() => {
    const result = CommentSchema.safeParse({
        book_id:'OL82563W',
        content: 'lune',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un contenu trop long', () => {
    const result = CommentSchema.safeParse({
      book_id: 'OL82563W',
      content: 'a'.repeat(751),
    });
    expect(result.success).toBe(false);
  });

});
