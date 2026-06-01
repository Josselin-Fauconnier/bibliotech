import { db } from '../db.js';

export async function getCommentsByBooks(bookId) {
  const [rows] = await db.execute(
    `SELECT c.id, c.content, c.created_at, u.username
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.book_id = ?
     ORDER BY c.created_at DESC`,
    [bookId]
  );
  return rows;
}

export async function createComment(userId, bookId, content) {
  const [result] = await db.execute(
    'INSERT INTO comments (user_id, book_id, content) VALUES (?, ?, ?)',
    [userId, bookId, content]
  );
  return result.insertId;
}

export async function deleteComment(commentId, userId) {
  const [result] = await db.execute(
    'DELETE FROM comments WHERE id = ? AND user_id = ?',
    [commentId, userId]
  );
  return result.affectedRows > 0;
}

export async function updateComment(commentId, userId, content) {
  const [result] = await db.execute(
    'UPDATE comments SET content = ? WHERE id = ? AND user_id = ?',
    [content, commentId, userId]
  );
  return result.affectedRows > 0;
}

export async function deleteCommentAdmin(commentId) {
  const [result] = await db.execute(
    'DELETE FROM comments WHERE id = ?',
    [commentId]
  );
  return result.affectedRows > 0;
}
