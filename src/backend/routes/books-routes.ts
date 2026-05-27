import { Router } from 'express';
export const booksRouter = Router();

booksRouter.get('/', async (req, res) => {
  const q = req.query.q;

  const response = await fetch(`https://openlibrary.org/search.json?q=${q}&limit=20`);
  const data = await response.json();

  res.json(data);
});

booksRouter.get('/work/:id', async (req, res) => {
  const response = await fetch(`https://openlibrary.org/works/${req.params.id}.json`);

  if (!response.ok) {
    res.status(response.status).json({ message: 'Livre introuvable' });
    return;
  }

  const data = await response.json();
  res.json(data);
});

booksRouter.get('/trending', async (_req, res) => {
  const response = await fetch('https://openlibrary.org/trending/daily.json?limit=20');

  if (!response.ok) {
    res.status(response.status).json({ message: 'Impossible de récupérer les tendances' });
    return;
  }

  const data = await response.json();
  res.json(data);
});

booksRouter.get('/author/:key', async (req, res) => {
  const response = await fetch(`https://openlibrary.org/authors/${req.params.key}.json`);

  if (!response.ok) {
    res.status(response.status).json({ message: 'Auteur introuvable' });
    return;
  }

  const data = await response.json();
  res.json(data);
});
