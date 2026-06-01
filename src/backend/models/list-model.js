import { db } from '../db.js';

export async function getListsByUser(userId) {
  const [rows] = await db.execute(
    'SELECT id, name, description, created_at FROM reading_lists WHERE user_id = ?',
    [userId]
  );
  return rows;
}

export async function createList(userId, name, description) {
  const [result] = await db.execute(
    'INSERT INTO reading_lists (user_id, name, description) VALUES (?, ?, ?)',
    [userId, name, description ?? null]
  );
  return result.insertId;
}

export async function deleteList(listId, userId) {
  const [result] = await db.execute(
    'DELETE FROM reading_lists WHERE id = ? AND user_id = ?',
    [listId, userId]
  );
  return result.affectedRows > 0;
}

export async function getBooksInList(listId) {
  const [rows] = await db.execute(
    'SELECT book_id, added_at FROM list_books WHERE list_id = ?',
    [listId]
  );
  return rows;
}

export async function addBooksToList(listId, bookId) {
  await db.execute(
    'INSERT INTO list_books (list_id, book_id) VALUES (?, ?)',
    [listId, bookId]
  );
}

export async function removeBookFromList(listId, bookId) {
  await db.execute(
    'DELETE FROM list_books WHERE list_id = ? AND book_id = ?',
    [listId, bookId]
  );
}
