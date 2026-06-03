import { Router } from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { getProfile, changePassword, deleteAccount } from '../controllers/user-controller.js';

export const userRouter = Router();

userRouter.use(isAuthenticated);

userRouter.get('/me', getProfile);
userRouter.put('/me/password', changePassword);
userRouter.delete('/me', deleteAccount);
