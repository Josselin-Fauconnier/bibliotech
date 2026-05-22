import { Router } from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import {getLists,createListHandler,deleteListHandler,getBooks,addBook,removeBook,
} from '../controllers/list-controller'


export const listsRouters = Router();

listsRouters.use(isAuthenticated);

listsRouters.get('/', getLists);
listsRouters.post('/', createListHandler);
listsRouters.delete('/:id', deleteListHandler);
listsRouters.get('/:id/books' , getBooks);
listsRouters.post('/:id/books' , addBook);
listsRouters.delete('/:id/books/:bookId', removeBook);
