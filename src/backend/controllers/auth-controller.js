import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { RegisterSchema, LoginSchema } from '../../shared/schemas/user-schema.js';
import { findUserByEmail, createUser, logUserEvent, countRecentFailedAttemps, logFailedAttempt } from '../models/user-model.js';

export async function register(req, res) {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: z.flattenError(parsed.error).fieldErrors });
    return;
  }

  const { username, email, password } = parsed.data;

  const existing = await findUserByEmail(email);
  if (existing) {
    res.status(409).json({ message: "l'email est déja utlisé" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const userId = await createUser(username, email, hashedPassword);
  await logUserEvent('register', userId);

  res.status(201).json({ message: ' le Compte  a bien été crée' });
}

export async function login(req, res) {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: z.flattenError(parsed.error).fieldErrors });
    return;
  }

  const { email, password } = parsed.data;
  const ip = req.ip ?? 'unknown';

  const attempts = await countRecentFailedAttemps(ip);
  if (attempts >= 5) {
    res.status(429).json({ message: 'Il y a eu trop de tentatives de connexion échouées. Réessayez plus tard.' });
    return;
  }

  const user = await findUserByEmail(email);
  const valid = user ? await bcrypt.compare(password, user.password) : false;
  if (!user || !valid) {
    await logFailedAttempt(ip, email);
    res.status(401).json({ message: "l'identifiant n'est pas connu" });
    return;
  }

  const now = new Date();
  if (user.banned_at && (!user.banned_until || user.banned_until > now)) {
    const until = user.banned_until
      ? `jusqu'au ${new Date(user.banned_until).toLocaleDateString('fr-FR')}`
      : 'définitivement';
    res.status(403).json({
      message: `Compte banni ${until}. Raison : ${user.ban_reason ?? 'non précisée'}`,
    });
    return;
  }

  await logUserEvent('login', user.id);

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? '12h' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 12,
  });

  res.json({ role: user.role, username: user.username });
}

export function logout(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  });
  res.json({ message: 'Vous êtes déconnecté' });
}
