// ============================================================
// AuditLogRepository — CRUD for audit_logs table
// ============================================================
import { query } from '../../lib/db';

export class AuditLogRepository {
  static async findAll(): Promise<any[]> {
    return query(
      'SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 200'
    ) as Promise<any[]>;
  }

  static async save(data: any): Promise<void> {
    await query(
      `INSERT INTO audit_logs (id, timestamp, \`user\`, role, action, details)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.id || null,
        data.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19),
        data.user, data.role, data.action, data.details
      ]
    );
  }

  static async deleteOlderThan(days: number): Promise<void> {
    await query(
      'DELETE FROM audit_logs WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)',
      [days]
    );
  }
}
