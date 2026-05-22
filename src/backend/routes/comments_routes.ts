import { Router } from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { getComments, createCommentHandler, deleteCommentHandler } from '../controllers/comment-controller';

export const commentsRouter = Router();

commentsRouter.get('/:bookId', getComments);
commentsRouter.post('/:bookId', isAuthenticated, createCommentHandler);
commentsRouter.delete('/:id', isAuthenticated, deleteCommentHandler);
