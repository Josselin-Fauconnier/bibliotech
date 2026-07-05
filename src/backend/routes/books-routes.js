import { Router } from 'express';
import { search, getWorkHandler, getTrendingHandler, getAuthorHandler } from '../controllers/book-controller.js';

export const booksRouter = Router();

booksRouter.get('/', search);
booksRouter.get('/work/:id', getWorkHandler);
booksRouter.get('/trending', getTrendingHandler);
booksRouter.get('/author/:key', getAuthorHandler);
