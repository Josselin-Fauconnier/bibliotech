import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { isAuthenticated } from './isAuthenticated.js';

vi.mock('jsonwebtoken');

const mockNext = vi.fn();

function buildRes() {
  const json = vi.fn();
  const status = vi.fn().mockReturnValue({ json });
  return { res: { status }, json, status };
}

describe('isAuthenticated', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retourne 401 si aucun cookie token', () => {
    const req = { headers: {} };
    const { res, status } = buildRes();

    isAuthenticated(req, res, mockNext);

    expect(status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('appelle next() et remplit req.user si le token est valide', () => {
    const req = { headers: { cookie: 'token=abc123' } };
    const { res } = buildRes();

    vi.mocked(jwt.verify).mockReturnValue({ userId: 1, role: 'user' });

    isAuthenticated(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledOnce();
    expect(req.user).toEqual({ userId: 1, role: 'user' });
  });

  it('retourne 401 si le token est invalide ou expiré', () => {
    const req = { headers: { cookie: 'token=tokeninvalide' } };
    const { res, status } = buildRes();

    vi.mocked(jwt.verify).mockImplementation(() => { throw new Error('invalid'); });

    isAuthenticated(req, res, mockNext);

    expect(status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
