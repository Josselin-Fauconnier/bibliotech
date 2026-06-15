import { db } from '../db.js';

export async function getAllUsers(page, limit) {
  const offset = (page - 1) * limit;

  const [rows] = await db.execute(
    `SELECT id, username, email, role, created_at FROM users
     WHERE deleted_at IS NULL
       AND (banned_at IS NULL OR (banned_until IS NOT NULL AND banned_until <= NOW()))
     ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
  );

  const [countRows] = await db.execute(
    `SELECT COUNT(*) as total FROM users
     WHERE deleted_at IS NULL
       AND (banned_at IS NULL OR (banned_until IS NOT NULL AND banned_until <= NOW()))`
  );

  return { data: rows, total: countRows[0].total };
}

export async function getAllComments(page, limit) {
  const offset = (page - 1) * limit;

  const [rows] = await db.execute(
    `SELECT c.id, c.content, c.created_at, c.book_id, u.username
     FROM comments c
     JOIN users u ON c.user_id = u.id
     ORDER BY c.created_at DESC
     LIMIT ${limit} OFFSET ${offset}`
  );

  const [countRows] = await db.execute(
    'SELECT COUNT(*) as total FROM comments'
  );

  return { data: rows, total: countRows[0].total };
}


export async function getBannedUsers(page, limit, type) {
  const offset = (page - 1) * limit;
  const typeFilter = type === 'permanent'
    ? 'AND banned_until IS NULL'
    : 'AND banned_until IS NOT NULL AND banned_until > NOW()';

  const [rows] = await db.execute(
    `SELECT id, username, ban_reason, banned_at, banned_until
     FROM users
     WHERE deleted_at IS NULL
       AND banned_at IS NOT NULL
       ${typeFilter}
     ORDER BY banned_at DESC
     LIMIT ${limit} OFFSET ${offset}`
  );

  const [countRows] = await db.execute(
    `SELECT COUNT(*) as total FROM users
     WHERE deleted_at IS NULL
       AND banned_at IS NOT NULL
       ${typeFilter}`
  );

  return { data: rows, total: countRows[0].total };
}

export async function banUser(userId, reason, bannedUntil) {
  const [result] = await db.execute(
    'UPDATE users SET banned_at = NOW(), banned_until = ?, ban_reason = ? WHERE id = ? AND deleted_at IS NULL',
    [bannedUntil ?? null, reason ?? null, userId]
  );
  return result.affectedRows > 0;
}

export async function unbanUser(userId) {
  const [result] = await db.execute(
    'UPDATE users SET banned_at = NULL, banned_until = NULL, ban_reason = NULL WHERE id = ? AND deleted_at IS NULL',
    [userId]
  );
  return result.affectedRows > 0;
}