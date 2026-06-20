import { Router } from 'express';

export const booksRouter = Router();

booksRouter.get('/', async (req, res) => {
  const q = req.query.q;
  const page = Number(req.query.page) || 1;

  try {
    const response = await fetch(`https://openlibrary.org/search.json?q=${q}&limit=20&page=${page}`);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la recherche de livres :', error);
    res.status(503).json({ message: 'Le service de recherche est momentanément indisponible, réessayez.' });
  }
});

booksRouter.get('/work/:id', async (req, res) => {
  try {
    const response = await fetch(`https://openlibrary.org/works/${req.params.id}.json`);

    if (!response.ok) {
      res.status(response.status).json({ message: "Le livre n'est pas dans la base" });
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération du livre :', error);
    res.status(503).json({ message: 'Le service est momentanément indisponible, réessayez.' });
  }
});

booksRouter.get('/trending', async (_req, res) => {
  try {
    const response = await fetch('https://openlibrary.org/trending/daily.json?limit=20');

    if (!response.ok) {
      res.status(response.status).json({ message: "Les tendances ne s'affichent pas " });
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des tendances :', error);
    res.status(503).json({ message: 'Le service est momentanément indisponible, réessayez.' });
  }
});

booksRouter.get('/author/:key', async (req, res) => {
  try {
    const response = await fetch(`https://openlibrary.org/authors/${req.params.key}.json`);

    if (!response.ok) {
      res.status(response.status).json({ message: "L'auteur est inconnue" });
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'auteur :", error);
    res.status(503).json({ message: 'Le service est momentanément indisponible, réessayez.' });
  }
});
