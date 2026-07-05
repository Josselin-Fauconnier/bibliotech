import { searchBooks, getWork, getTrending, getAuthor } from '../models/book-model.js';

export async function search(req, res) {
  const q = req.query.q;
  const page = Number(req.query.page) || 1;

  try {
    const data = await searchBooks(q, page);
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la recherche de livres :', error);
    res.status(503).json({ message: 'Le service de recherche est momentanément indisponible, réessayez.' });
  }
}

export async function getWorkHandler(req, res) {
  try {
    const { ok, status, data } = await getWork(req.params.id);
    if (!ok) {
      res.status(status).json({ message: "Le livre n'est pas dans la base" });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération du livre :', error);
    res.status(503).json({ message: 'Le service est momentanément indisponible, réessayez.' });
  }
}

export async function getTrendingHandler(_req, res) {
  try {
    const { ok, status, data } = await getTrending();
    if (!ok) {
      res.status(status).json({ message: "Les tendances ne s'affichent pas " });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des tendances :', error);
    res.status(503).json({ message: 'Le service est momentanément indisponible, réessayez.' });
  }
}

export async function getAuthorHandler(req, res) {
  try {
    const { ok, status, data } = await getAuthor(req.params.key);
    if (!ok) {
      res.status(status).json({ message: "L'auteur est inconnue" });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'auteur :", error);
    res.status(503).json({ message: 'Le service est momentanément indisponible, réessayez.' });
  }
}
