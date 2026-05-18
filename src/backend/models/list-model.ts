import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { db } from '../db';

export async function getListsByUser(userId: number) {
  const [rows] = await db.execute<RowDataPacket[]>(
    'SELECT id, name, description, created_at FROM reading_lists WHERE user_id = ?',
    [userId]
  );
  return rows;
}

export async function createList(
  userId: number,
  name: string,
  description: string | undefined
): Promise<number> {
  const [result] = await db.execute<ResultSetHeader>(
    'INSERT INTO reading_lists (user_id, name, description) VALUES (?, ?, ?)',
    [userId, name, description ?? null]
  );
  return result.insertId;
}

export async function deleteList(listId: number, userId: number): Promise<boolean> {
  const [result] = await db.execute<ResultSetHeader>(
    'DELETE FROM reading_lists WHERE id = ? AND user_id = ?',
    [listId, userId]
  );
  return result.affectedRows > 0;
}

export async function getBooksInList(listId: number) {
  const [rows] = await db.execute<RowDataPacket[]>(
    'SELECT book_id, added_at FROM list_books WHERE list_id = ?',
    [listId]
  );
  return rows;
}

export async function addBooksToList(listId: number, bookId: string): Promise<void> {
  await db.execute(
    'INSERT INTO list_books (list_id, book_id) VALUES (?, ?)',
    [listId, bookId]
  );
}

export async function removeBookFromList(listId: number, bookId: string): Promise<void> {
  await db.execute(
    'DELETE FROM list_books WHERE list_id = ? AND book_id = ?',
    [listId, bookId]
  );
}
