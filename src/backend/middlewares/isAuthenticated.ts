import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: number; role: string };
    }
  }
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const token = getCookie(req,'token');

  if (!token) {
    res.status(401).json({ message: 'Non authentifié' });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; role: string };
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
}


function getCookie(req: Request , name: string) : string | undefined {
    const header = req.headers.cookie;
    if (!header) return undefined;

    const cookie = header
    .split(';')
    .find(c => c.trim().startsWith(`${name}=`));

    return cookie?.split('=')[1];
}