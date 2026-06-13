import { db } from '../db.js';

export async function findUserByEmail(email) {
  const [rows] = await db.execute(
   'SELECT id, username, email, password, role, banned_at, banned_until, ban_reason FROM users WHERE email = ? AND deleted_at IS NULL',
    [email]
  );
  return rows[0] ?? null;
}

export async function createUser(username, email, hashedPassword) {
  const [result] = await db.execute(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, 'user']
  );
  return result.insertId;
}

export async function logUserEvent(event_type, user_id) {
  await db.execute(
    'INSERT INTO user_events (event_type, user_id) VALUES (?, ?)',
    [event_type, user_id]
  );
}

export async function countRecentFailedAttemps(ip) {
  const [rows] = await db.execute(
    `SELECT COUNT(*) as total FROM login_attempts
     WHERE ip = ? AND created_at > DATE_SUB(NOW(), INTERVAL 6 HOUR)`,
    [ip]
  );
  return rows[0].total;
}

export async function logFailedAttempt(ip, email) {
  await db.execute(
    'INSERT INTO login_attempts (ip, email) VALUES (?, ?)',
    [ip, email]
  );
}


export async function findUserById(userId) {
  const [rows] = await db.execute(
    'SELECT id, username, email, password, banned_at, banned_until FROM users WHERE id = ? AND deleted_at IS NULL',
    [userId]
  );
  return rows[0] ?? null;
}

export async function getUserById(userId) {
  const [rows] = await db.execute(
    'SELECT id, username, email, created_at FROM users WHERE id = ? AND deleted_at IS NULL',
    [userId]
  );
  return rows[0] ?? null;
}

export async function updatePassword(userId, hashedPassword) {
  const [result] = await db.execute(
    'UPDATE users SET password = ? WHERE id = ? AND deleted_at IS NULL',
    [hashedPassword, userId]
  );
  return result.affectedRows > 0;
}

export async function deleteUser(userId) {
  const [userRows] = await db.execute(
    'SELECT email FROM users WHERE id = ? AND deleted_at IS NULL',
    [userId]
  );
  if (userRows.length === 0) return false;

  await db.execute('DELETE FROM login_attempts WHERE email = ?', [userRows[0].email]);

  const [result] = await db.execute(
    `UPDATE users SET
      deleted_at = NOW(),
      email = CONCAT('deleted_', id, '@deleted.local'),
      username = CONCAT('utilisateur_supprime_', id),
      password = 'DELETED'
     WHERE id = ? AND deleted_at IS NULL`,
    [userId]
  );
  return result.affectedRows > 0;
}

export async function getRecentCommentsByUser(userId, page, limit) {
  const offset = (page - 1) * limit;
  const [rows] = await db.execute(
    `SELECT id, content, book_id, created_at FROM comments
     WHERE user_id = ? ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );
  const [countRows] = await db.execute(
    'SELECT COUNT(*) as total FROM comments WHERE user_id = ?',
    [userId]
  );
  return { data: rows, total: countRows[0].total };
}
