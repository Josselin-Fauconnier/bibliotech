import { z } from 'zod';
import { CreateListSchema } from '../../shared/schemas/list-schema.js';
import { getListsByUser, createList, deleteList, getBooksInList, addBooksToList, removeBookFromList, countBooksInList, isBookInList } from '../models/list-model.js';

const maxBooks = 10;

export async function getLists(req, res) {
  const lists = await getListsByUser(req.user.userId);
  res.json(lists);
}

export async function createListHandler(req, res) {
  const parsed = CreateListSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: z.flattenError(parsed.error).fieldErrors });
    return;
  }

  const { name, description } = parsed.data;
  const listId = await createList(req.user.userId, name, description);

  res.status(201).json({ id: listId, name, description });
}

export async function deleteListHandler(req, res) {
  const listId = Number(req.params.id);
  if (isNaN(listId)) {
    res.status(400).json({ message: 'Id invalide' });
    return;
  }

  const deleted = await deleteList(listId, req.user.userId);
  if (!deleted) {
    res.status(404).json({ message: 'La liste est introuvable' });
    return;
  }

  res.status(204).send();
}

export async function getBooks(req, res) {
  const listId = Number(req.params.id);
  const books = await getBooksInList(listId);
  res.json(books);
}

export async function addBook(req, res) {
  const listId = Number(req.params.id);
  const { bookId } = req.body;

  if (!bookId) {
    res.status(400).json({ message: 'Les données sont invalides' });
    return;
  }

  const alreadyInList = await isBookInList(listId, bookId);
  if (alreadyInList) {
    res.status(409).json({ message: 'Ce livre est déjà dans la liste' });
    return;
  }

  const total = await countBooksInList(listId);
  if (total >= MAX_BOOKS_PER_LIST) {
    res.status(409).json({ message: `Une liste ne peut pas contenir plus de ${maxBooks} livres` });
    return;
  }

  await addBooksToList(listId, bookId);
  res.status(201).json({ message: 'Le livre a été ajouté' });
}

export async function removeBook(req, res) {
  const listId = Number(req.params.id);
  const bookId = String(req.params.bookId);

  if (!bookId) {
    res.status(400).json({ message: 'les données sont invalides' });
    return;
  }

  await removeBookFromList(listId, bookId);
  res.status(204).send();
}
