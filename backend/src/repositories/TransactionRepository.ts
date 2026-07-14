// ============================================================
// TransactionRepository — Full CRUD for transactions table
// ============================================================
import { query } from '../../lib/db';

export class TransactionRepository {
  static async findAll(): Promise<any[]> {
    return query('SELECT * FROM transactions ORDER BY date DESC') as Promise<any[]>;
  }

  static async findById(id: string): Promise<any> {
    const rows = await query('SELECT * FROM transactions WHERE id = ?', [id]) as any[];
    return rows[0] || null;
  }

  static async save(data: any): Promise<void> {
    await query(
      `INSERT INTO transactions (id, date, amount, method, status, customer)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         status = VALUES(status)`,
      [
        data.id, data.date, data.amount,
        data.method, data.status, data.customer
      ]
    );
  }

  static async updateStatus(id: string, status: string): Promise<void> {
    await query('UPDATE transactions SET status = ? WHERE id = ?', [status, id]);
  }

  static async delete(id: string): Promise<void> {
    await query('DELETE FROM transactions WHERE id = ?', [id]);
  }

  static async sumCompleted(): Promise<number> {
    const rows = await query(
      "SELECT SUM(amount) as total FROM transactions WHERE status = 'Completed'"
    ) as any[];
    return rows[0]?.total || 0;
  }
}
