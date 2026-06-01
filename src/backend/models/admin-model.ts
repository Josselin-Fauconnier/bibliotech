import { RowDataPacket } from 'mysql2';
import { db } from '../db';

export async function getAllUsers(page: number, limit: number) {
  const offset = (page - 1) * limit;

  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, username, email, role, created_at FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
  );

  const [countRows] = await db.execute<RowDataPacket[]>(
    'SELECT COUNT(*) as total FROM users WHERE deleted_at IS NULL'
  );

  return { data: rows, total: countRows[0].total as number };
}

export async function getAllComments(page: number, limit: number) {
  const offset = (page - 1) * limit;

  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT c.id, c.content, c.created_at, c.book_id, u.username
     FROM comments c
     JOIN users u ON c.user_id = u.id
     ORDER BY c.created_at DESC
     LIMIT ${limit} OFFSET ${offset}`
  );

  const [countRows] = await db.execute<RowDataPacket[]>(
    'SELECT COUNT(*) as total FROM comments'
  );

  return { data: rows, total: countRows[0].total as number };
}
