import { Router } from 'express';
export const booksRouter = Router();

booksRouter.get('/', async (req, res) => {
  const q = req.query.q;

  const response = await fetch(`https://openlibrary.org/search.json?q=${q}&limit=20`);
  const data = await response.json();

  res.json(data);
});
