import { Router } from 'express';

export const booksRouter = Router();

booksRouter.get('/', async (req, res) => {
  const q = req.query.q;
  const page = Number(req.query.page) || 1;

  const response = await fetch(`https://openlibrary.org/search.json?q=${q}&limit=20&page=${page}`);
  const data = await response.json();

  res.json(data);
});

booksRouter.get('/work/:id', async (req, res) => {
  const response = await fetch(`https://openlibrary.org/works/${req.params.id}.json`);

  if (!response.ok) {
    res.status(response.status).json({ message: "Le livre n'est pas dans la base" });
    return;
  }

  const data = await response.json();
  res.json(data);
});

booksRouter.get('/trending', async (_req, res) => {
  const response = await fetch('https://openlibrary.org/trending/daily.json?limit=20');

  if (!response.ok) {
    res.status(response.status).json({ message: "Les tendances ne s'affichent pas " });
    return;
  }

  const data = await response.json();
  res.json(data);
});

booksRouter.get('/author/:key', async (req, res) => {
  const response = await fetch(`https://openlibrary.org/authors/${req.params.key}.json`);

  if (!response.ok) {
    res.status(response.status).json({ message: "L'auteur est inconnue" });
    return;
  }

  const data = await response.json();
  res.json(data);
});
