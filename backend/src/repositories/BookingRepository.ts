// ============================================================
// BookingRepository — Full CRUD for bookings table
// ============================================================
import { query } from '../../lib/db';

export class BookingRepository {
  static async findAll(): Promise<any[]> {
    return query('SELECT * FROM bookings ORDER BY booked_at DESC') as Promise<any[]>;
  }

  static async findById(id: string): Promise<any> {
    const rows = await query('SELECT * FROM bookings WHERE id = ?', [id]) as any[];
    return rows[0] || null;
  }

  static async save(data: any): Promise<void> {
    await query(
      `INSERT INTO bookings (id, tour_id, tour_title, date, guests, total_price, status, user_email, user_name, booked_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         status = VALUES(status),
         guests = VALUES(guests),
         total_price = VALUES(total_price)`,
      [
        data.id, data.tour_id, data.tour_title, data.date,
        data.guests, data.total_price, data.status,
        data.user_email, data.user_name, data.booked_at
      ]
    );
  }

  static async updateStatus(id: string, status: string): Promise<void> {
    await query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
  }

  static async delete(id: string): Promise<void> {
    await query('DELETE FROM bookings WHERE id = ?', [id]);
  }
}
