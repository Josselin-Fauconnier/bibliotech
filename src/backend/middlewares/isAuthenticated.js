import jwt from 'jsonwebtoken';
import {findUserById} from '../models/user-model.js';

export  async function isAuthenticated(req, res, next) {
  const token = getCookie(req, 'token');

  if (!token) {
    res.status(401).json({ message: 'Non authentifié' });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await findUserById(payload.userId);
    if (!user) {
      res.status(401).json({ message: "cet utilisateur n'est pas trouvable " });
      return;
    }

    const now = new Date();
    if (user.banned_at && (!user.banned_until || user.banned_until > now)) {
      res.status(403).json({ message: "Ce compte est banni" });
      return;
    }

    const newToken = jwt.sign(
      { userId: payload.userId, role: payload.role },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    res.cookie('token', newToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 30,
    });

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
