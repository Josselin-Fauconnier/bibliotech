import { getAllUsers, getAllComments } from '../models/admin-model.js';
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
