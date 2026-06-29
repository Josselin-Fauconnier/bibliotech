import bcrypt from 'bcrypt';
import { getUserById, findUserById, updatePassword, deleteUser, getRecentCommentsByUser } from '../models/user-model.js';

const LIMIT = 5;

export async function getProfile(req, res) {
  const user = await getUserById(req.user.userId);
  if (!user) {
    res.status(404).json({ message: "l'utilisateur n'est pas trouvable " });
    return;
  }

  const page = Math.max(1, Number(req.query.page) || 1);
  const { data, total } = await getRecentCommentsByUser(req.user.userId, page, LIMIT);

  res.json({
    user,
    comments: {
      data,
      page,
      total,
      totalPages: Math.ceil(total / LIMIT),
    },
  });
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400).json({ message: 'Les deux mots de passe sont requis' });
    return;
  }

  const user = await findUserById(req.user.userId);
  if (!user) {
    res.status(404).json({ message: 'Utilisateur introuvable' });
    return;
  }

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    res.status(401).json({ message: "ce n'est pas votre mot de passe actuel "});
    return;
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  await updatePassword(req.user.userId, hashed);

  res.json({ message: "le mot de passe a bien été modifié " });
}

export async function deleteAccount(req, res) {
  const deleted = await deleteUser(req.user.userId);
  if (!deleted) {
    res.status(404).json({ message: 'Utilisateur introuvable' });
    return;
  }

  res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'strict' });
  res.json({ message: "le compte a bien été suprimé " });
}
