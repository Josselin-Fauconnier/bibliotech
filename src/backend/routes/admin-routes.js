import { Router } from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { getUsersHandler, getCommentsHandler, getBannedUsersHandler, deleteCommentAdminHandler, banUserHandler } from '../controllers/admin-controller.js';

export const adminRouter = Router();

adminRouter.use(isAuthenticated);
adminRouter.use(isAdmin);

adminRouter.get('/users', getUsersHandler);
adminRouter.get('/comments', getCommentsHandler);
adminRouter.delete('/comments/:id', deleteCommentAdminHandler);
adminRouter.get('/banned-users', getBannedUsersHandler);
adminRouter.patch('/users/:id/ban', banUserHandler);
