// ============================================================
// RoomRepository — Full CRUD for rooms table
// ============================================================
import { query } from '../../lib/db';

export class RoomRepository {
  static async findAll(): Promise<any[]> {
    return query('SELECT * FROM rooms ORDER BY name ASC') as Promise<any[]>;
  }

  static async findById(id: string): Promise<any> {
    const rows = await query('SELECT * FROM rooms WHERE id = ?', [id]) as any[];
    return rows[0] || null;
  }

  static async save(data: any): Promise<void> {
    await query(
      `INSERT INTO rooms (id, name, type, price, status, amenities, image, current_booking)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         type = VALUES(type),
         price = VALUES(price),
         status = VALUES(status),
         amenities = VALUES(amenities),
         image = VALUES(image),
         current_booking = VALUES(current_booking)`,
      [
        data.id, data.name, data.type, data.price,
        data.status || 'Available',
        data.amenities ? JSON.stringify(data.amenities) : '[]',
        data.image || '',
        data.current_booking ? JSON.stringify(data.current_booking) : null
      ]
    );
  }

  static async updateStatus(id: string, status: string): Promise<void> {
    await query('UPDATE rooms SET status = ? WHERE id = ?', [status, id]);
  }

  static async updateBooking(id: string, bookingData: any): Promise<void> {
    await query(
      'UPDATE rooms SET current_booking = ?, status = ? WHERE id = ?',
      [JSON.stringify(bookingData), 'Occupied', id]
    );
  }

  static async delete(id: string): Promise<void> {
    await query('DELETE FROM rooms WHERE id = ?', [id]);
  }
}
