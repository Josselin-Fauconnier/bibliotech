import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/user-model.js';
import { isAuthenticated } from './isAuthenticated.js';

vi.mock('jsonwebtoken');
vi.mock('../models/user-model.js');

const mockNext = vi.fn();

function buildRes() {
  const json = vi.fn();
  const cookie = vi.fn();
  const status = vi.fn().mockReturnValue({ json });
  return { res: { status, json, cookie }, json, status, cookie };
}

describe('isAuthenticated', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retourne 401 si aucun cookie token', async () => {
    const req = { headers: {} };
    const { res, status } = buildRes();

    await isAuthenticated(req, res, mockNext);

    expect(status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('appelle next() et remplit req.user si le token est valide', async () => {
    const req = { headers: { cookie: 'token=abc123' } };
    const { res } = buildRes();

    vi.mocked(jwt.verify).mockReturnValue({ userId: 1, role: 'user' });
    vi.mocked(jwt.sign).mockReturnValue('nouveau-token');
    vi.mocked(userModel.findUserById).mockResolvedValue({
      id: 1,
      username: 'Alice',
      banned_at: null,
      banned_until: null,
    });

    await isAuthenticated(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledOnce();
    expect(req.user).toEqual({ userId: 1, role: 'user' });
  });

  it('retourne 401 si utilisateur introuvable en BDD', async () => {
    const req = { headers: { cookie: 'token=abc123' } };
    const { res, status } = buildRes();

    vi.mocked(jwt.verify).mockReturnValue({ userId: 99, role: 'user' });
    vi.mocked(userModel.findUserById).mockResolvedValue(null);

    await isAuthenticated(req, res, mockNext);

    expect(status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('retourne 403 si le compte est banni', async () => {
    const req = { headers: { cookie: 'token=abc123' } };
    const { res, status } = buildRes();

    vi.mocked(jwt.verify).mockReturnValue({ userId: 1, role: 'user' });
    vi.mocked(userModel.findUserById).mockResolvedValue({
      id: 1,
      username: 'Alice',
      banned_at: new Date('2026-01-01'),
      banned_until: null,
    });

    await isAuthenticated(req, res, mockNext);

    expect(status).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('retourne 401 si le token est invalide ou expiré', async () => {
    const req = { headers: { cookie: 'token=tokeninvalide' } };
    const { res, status } = buildRes();

    vi.mocked(jwt.verify).mockImplementation(() => { throw new Error('invalid'); });

    await isAuthenticated(req, res, mockNext);

    expect(status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
