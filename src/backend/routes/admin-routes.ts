import { Router } from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { isAdmin } from '../middlewares/isAdmin';
import { getUsersHandler, getCommentsHandler, deleteCommentAdminHandler } from '../controllers/admin-controller';

export const adminRouter = Router();

adminRouter.use(isAuthenticated);
adminRouter.use(isAdmin);

adminRouter.get('/users', getUsersHandler);
adminRouter.get('/comments', getCommentsHandler);
adminRouter.delete('/comments/:id', deleteCommentAdminHandler);
