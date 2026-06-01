import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { db } from '../db';

export async function getCommentsByBooks(bookId: string) {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT c.id, c.content, c.created_at, u.username
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.book_id = ?
     ORDER BY c.created_at DESC`,
    [bookId]
  );
  return rows;
}

export async function createComment(userId: number,
  bookId: string,
  content: string
): Promise<number> {
  const [result] = await db.execute<ResultSetHeader>(
    'INSERT INTO comments (user_id, book_id, content) VALUES (?, ?, ?)',
    [userId, bookId, content]
  );
  return result.insertId;
}

export async function deleteComment(
  commentId: number,
  userId: number
): Promise<boolean> {
  const [result] = await db.execute<ResultSetHeader>(
    'DELETE FROM comments WHERE id = ? AND user_id = ?',
    [commentId, userId]
  );
  return result.affectedRows > 0;
}

export async function updateComment(commentId: number, userId: number, content: string): Promise<boolean> {
  const [result] = await db.execute<ResultSetHeader>(
    'UPDATE comments SET content = ? WHERE id = ? AND user_id = ?',
    [content, commentId, userId]
  );
  return result.affectedRows > 0;
}

export async function deleteCommentAdmin(commentId: number): Promise<boolean> {
  const [result] = await db.execute<ResultSetHeader>(
    'DELETE FROM comments WHERE id = ?',
    [commentId]
  );
  return result.affectedRows > 0;
}
