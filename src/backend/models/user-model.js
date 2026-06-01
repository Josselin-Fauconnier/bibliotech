import { db } from '../db.js';

export async function findUserByEmail(email) {
  const [rows] = await db.execute(
    'SELECT id, username, email, password, role FROM users WHERE email = ? AND deleted_at IS NULL',
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
