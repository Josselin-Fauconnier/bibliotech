import { getAllUsers, getAllComments, getBannedUsers, banUser } from '../models/admin-model.js';
import { deleteCommentAdmin } from '../models/comment-model.js';

const LIMIT = 15;

export async function getUsersHandler(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const { data, total } = await getAllUsers(page, LIMIT);

  res.json({
    data,
    page,
    total,
    totalPages: Math.ceil(total / LIMIT),
  });
}

export async function getCommentsHandler(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const { data, total } = await getAllComments(page, LIMIT);

  res.json({
    data,
    page,
    total,
    totalPages: Math.ceil(total / LIMIT),
  });
}

export async function getBannedUsersHandler(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const type = req.query.type === 'permanent' ? 'permanent' : 'temp';
  const { data, total } = await getBannedUsers(page, LIMIT, type);

  res.json({
    data,
    page,
    total,
    totalPages: Math.ceil(total / LIMIT),
  });
}

export async function deleteCommentAdminHandler(req, res) {
  const commentId = Number(req.params.id);
  if (isNaN(commentId)) {
    res.status(400).json({ message: "L'ID n'est pas valide" });
    return;
  }

  const deleted = await deleteCommentAdmin(commentId);
  if (!deleted) {
    res.status(404).json({ message: "Le commentaire n'existe pas" });
    return;
  }

  res.status(204).send();
}

export async function banUserHandler(req, res) {
  const userId = Number(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ message: "cet id est invalide " });
    return;
  }

  if (userId === req.user.userId) {
    res.status(403).json({ message: "il n'est pas possible de t'autobannir " });
    return;
  }

  const { reason, duration_days } = req.body;
  const bannedUntil = duration_days
    ? new Date(Date.now() + duration_days * 86400000)
    : null;

  const banned = await banUser(userId, reason, bannedUntil);
  if (!banned) {
    res.status(404).json({ message: "L'utilisateur n'existe pas" });
    return;
  }

  res.status(204).send();
}

