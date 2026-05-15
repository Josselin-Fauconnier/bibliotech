import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { db } from '../db';

export async function findUserByEmail(email: string) {
  const [rows] = await db.execute<RowDataPacket[]>(
    'SELECT id, username, email, password, role FROM users WHERE email = ? AND deleted_at IS NULL',
    [email]
  );
  return rows[0] ?? null;
}

export async function createUser(
  username: string,
  email: string,
  hashedPassword: string
): Promise<number> {
  const [result] = await db.execute<ResultSetHeader>(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, 'user']
  );
  return result.insertId;
}

export async function logUserEvent(
  event_type: 'register' | 'login' | 'delete',
  user_id: number | null
) {
  await db.execute(
    'INSERT INTO user_events (event_type, user_id) VALUES (?, ?)',
    [event_type, user_id]
  );
}


export async function countRecentFailedAttemps(ip:string): Promise<number>{
    const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM login_attempts
     WHERE ip = ? AND created_at > DATE_SUB(NOW(), INTERVAL 6 HOUR)`,
    [ip]
  );
  return rows[0].total as number;
}

export async function logFailedAttempt(ip:string, email: string): Promise<void> {
    await db.execute(
        'INSERT INTO login_attempts (ip, email) VALUES (?, ?)',
    [ip, email]
    );
}
