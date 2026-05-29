import { Request, Response } from 'express';
import { z } from 'zod';
import { CommentSchema } from '../../shared/schemas/comment-schema';
import { getCommentsByBooks, createComment, deleteComment, updateComment } from '../models/comment-model';

export async function getComments(req: Request, res: Response) {
  const bookId = String(req.params.bookId);
  const comments = await getCommentsByBooks(bookId);
  res.json(comments);
}

export async function createCommentHandler(req: Request, res: Response) {
  const parsed = CommentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: z.flattenError(parsed.error).fieldErrors });
    return;
  }

  const bookId = String(req.params.bookId);
  await createComment(req.user!.userId, bookId, parsed.data.content);

  res.status(201).json({ message: 'Le commentaire a été posté' });
}

export async function deleteCommentHandler(req: Request, res: Response) {
  const commentId = Number(req.params.id);
  if (isNaN(commentId)) {
    res.status(400).json({ message: "l'ID  n'est pas valide" });
    return;
  }

  const deleted = await deleteComment(commentId, req.user!.userId);
  if (!deleted) {
    res.status(404).json({ message: "le commentaire n'existe pas"});
    return;
  }

  res.status(204).send();
}

export async function updateCommentHandler(req: Request, res: Response) {
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

  const updated = await updateComment(commentId, req.user!.userId, parsed.data.content);
  if (!updated) {
    res.status(404).json({ message: "le commentaire n'existe pas" });
    return;
  }

  res.json({ message: 'Commentaire modifié' });
}
