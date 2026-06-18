import { Router } from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { isListOwner } from '../middlewares/isListOwner.js';
import { getLists, createListHandler, deleteListHandler, getBooks, addBook, removeBook } from '../controllers/list-controller.js';

export const listsRouters = Router();

listsRouters.use(isAuthenticated);

listsRouters.get('/', getLists);
listsRouters.post('/', createListHandler);
listsRouters.delete('/:id', deleteListHandler);
listsRouters.get('/:id/books', isListOwner, getBooks);
listsRouters.post('/:id/books', isListOwner, addBook);
listsRouters.delete('/:id/books/:bookId', isListOwner, removeBook);
