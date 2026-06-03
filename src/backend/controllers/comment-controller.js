import { z } from 'zod';
import { CommentSchema } from '../../shared/schemas/comment-schema.js';
import { getCommentsByBooks, createComment, deleteComment, updateComment, getLastTimeComment } from '../models/comment-model.js';

export async function getComments(req, res) {
  const bookId = String(req.params.bookId);
  const comments = await getCommentsByBooks(bookId);
  res.json(comments);
}

export async function createCommentHandler(req, res) {
  const parsed = CommentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: z.flattenError(parsed.error).fieldErrors });
    return;
  }

  const lastComment = await getLastTimeComment(req.user.userId);
  if (lastComment) {
    const diff = Date.now() - new Date(lastComment).getTime();
    if (diff < 300000) {
      const totalSeconds = Math.ceil((300000 - diff) / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const remaining = minutes > 0
        ? `${minutes} minute${minutes > 1 ? 's' : ''} et ${seconds} seconde${seconds > 1 ? 's' : ''}`
        : `${seconds} seconde${seconds > 1 ? 's' : ''}`;
      res.status(429).json({
        message: `Vous devez attendre ${remaining} avant de poster un nouveau commentaire.`,
      });
      return;
    }
  }

  const bookId = String(req.params.bookId);
  await createComment(req.user.userId, bookId, parsed.data.content);

  res.status(201).json({ message: 'Le commentaire a été posté' });
}

export async function deleteCommentHandler(req, res) {
  const commentId = Number(req.params.id);
  if (isNaN(commentId)) {
    res.status(400).json({ message: "l'ID  n'est pas valide" });
    return;
  }

  const deleted = await deleteComment(commentId, req.user.userId);
  if (!deleted) {
    res.status(404).json({ message: "le commentaire n'existe pas" });
    return;
  }

  res.status(204).send();
}

export async function updateCommentHandler(req, res) {
  const commentId = Number(req.params.id);
  if (isNaN(commentId)) {
    res.status(400).json({ message: "l'ID n'est pas valide" });
    return;
  }

  const parsed = CommentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: z.flattenError(parsed.error).fieldErrors });
    return;
  }

  const updated = await updateComment(commentId, req.user.userId, parsed.data.content);
  if (!updated) {
    res.status(404).json({ message: "le commentaire n'existe pas" });
    return;
  }

  res.json({ message: 'Commentaire modifié' });
}
