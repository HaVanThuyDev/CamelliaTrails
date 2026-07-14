// ============================================================
// CustomerRepository — Full CRUD for customers table
// ============================================================
import { query } from '../../lib/db';

export class CustomerRepository {
  static async findAll(): Promise<any[]> {
    return query('SELECT * FROM customers ORDER BY created_at DESC') as Promise<any[]>;
  }

  static async findById(id: string): Promise<any> {
    const rows = await query('SELECT * FROM customers WHERE id = ?', [id]) as any[];
    return rows[0] || null;
  }

  static async findByEmail(email: string): Promise<any> {
    const rows = await query('SELECT * FROM customers WHERE email = ?', [email]) as any[];
    return rows[0] || null;
  }

  static async save(data: any): Promise<void> {
    await query(
      `INSERT INTO customers (id, name, email, phone, country, total_bookings, total_spent, avatar, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         phone = VALUES(phone),
         country = VALUES(country),
         total_bookings = VALUES(total_bookings),
         total_spent = VALUES(total_spent)`,
      [
        data.id, data.name, data.email, data.phone || '',
        data.country || '', data.total_bookings || 0,
        data.total_spent || 0, data.avatar || '',
        data.created_at || new Date().toISOString().split('T')[0]
      ]
    );
  }

  static async incrementBooking(email: string, amount: number): Promise<void> {
    await query(
      'UPDATE customers SET total_bookings = total_bookings + 1, total_spent = total_spent + ? WHERE email = ?',
      [amount, email]
    );
  }

  static async delete(id: string): Promise<void> {
    await query('DELETE FROM customers WHERE id = ?', [id]);
  }
}
