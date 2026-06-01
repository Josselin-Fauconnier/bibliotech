import jwt from 'jsonwebtoken';

export function isAuthenticated(req, res, next) {
  const token = getCookie(req, 'token');

  if (!token) {
    res.status(401).json({ message: 'Non authentifié' });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
}

function getCookie(req, name) {
  const header = req.headers.cookie;
  if (!header) return undefined;

  const cookie = header
    .split(';')
    .find(c => c.trim().startsWith(`${name}=`));

  return cookie?.split('=')[1];
}
