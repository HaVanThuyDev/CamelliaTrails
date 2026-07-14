import { query } from '../../lib/db';
import { UserEntity } from '../entities/UserEntity';

export class UserRepository {
  /**
   * Find a user by email address
   */
  static async findByEmail(email: string): Promise<UserEntity | null> {
    const rows = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows || (rows as any[]).length === 0) return null;
    return (rows as any[])[0] as UserEntity;
  }

  /**
   * Find a user by ID
   */
  static async findById(id: string): Promise<UserEntity | null> {
    const rows = await query('SELECT * FROM users WHERE id = ?', [id]);
    if (!rows || (rows as any[]).length === 0) return null;
    return (rows as any[])[0] as UserEntity;
  }

  /**
   * Create a new user profile in database
   */
  static async create(user: Omit<UserEntity, 'created_at'>): Promise<void> {
    const sql = `
      INSERT INTO users (id, name, email, password_hash, role, avatar)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    await query(sql, [user.id, user.name, user.email, user.password_hash, user.role, user.avatar]);
  }
}
