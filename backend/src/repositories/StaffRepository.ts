// ============================================================
// StaffRepository — Full CRUD for staff table
// ============================================================
import { query } from '../../lib/db';

export class StaffRepository {
  static async findAll(): Promise<any[]> {
    return query('SELECT * FROM staff ORDER BY name ASC') as Promise<any[]>;
  }

  static async findById(id: string): Promise<any> {
    const rows = await query('SELECT * FROM staff WHERE id = ?', [id]) as any[];
    return rows[0] || null;
  }

  static async save(data: any): Promise<void> {
    await query(
      `INSERT INTO staff (id, name, email, role, avatar, status, checked_in_at, checked_out_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         email = VALUES(email),
         role = VALUES(role),
         avatar = VALUES(avatar),
         status = VALUES(status),
         checked_in_at = VALUES(checked_in_at),
         checked_out_at = VALUES(checked_out_at)`,
      [
        data.id, data.name, data.email, data.role,
        data.avatar || '', data.status || 'active',
        data.checked_in_at || null, data.checked_out_at || null
      ]
    );
  }

  static async updateAttendance(id: string, checkIn: string | null, checkOut: string | null): Promise<void> {
    await query(
      'UPDATE staff SET checked_in_at = ?, checked_out_at = ? WHERE id = ?',
      [checkIn, checkOut, id]
    );
  }

  static async updateStatus(id: string, status: string): Promise<void> {
    await query('UPDATE staff SET status = ? WHERE id = ?', [status, id]);
  }

  static async delete(id: string): Promise<void> {
    await query('DELETE FROM staff WHERE id = ?', [id]);
  }
}
