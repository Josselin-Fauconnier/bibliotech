import { Router } from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { getComments, createCommentHandler, deleteCommentHandler, updateCommentHandler } from '../controllers/comment-controller.js';

export const commentsRouter = Router();

commentsRouter.get('/:bookId', getComments);
commentsRouter.post('/:bookId', isAuthenticated, createCommentHandler);
commentsRouter.delete('/:id', isAuthenticated, deleteCommentHandler);
commentsRouter.put('/:id', isAuthenticated, updateCommentHandler);
