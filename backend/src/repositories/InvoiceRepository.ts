import { query } from '../../lib/db';
import { InvoiceEntity } from '../entities/InvoiceEntity';

export class InvoiceRepository {
  /**
   * Get all invoices sorted by date descending
   */
  static async findAll(): Promise<InvoiceEntity[]> {
    const rows = await query('SELECT * FROM invoices ORDER BY created_date DESC, id DESC');
    return rows as InvoiceEntity[];
  }

  /**
   * Save or Update an invoice draft
   */
  static async save(invoice: InvoiceEntity): Promise<void> {
    const sql = `
      INSERT INTO invoices (id, template_code, invoice_series, created_date, buyer_name, buyer_legal_name, buyer_tax_code, total_pre_tax, total_tax, total_amount, currency_code, status, payload_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        buyer_name = VALUES(buyer_name),
        buyer_legal_name = VALUES(buyer_legal_name),
        buyer_tax_code = VALUES(buyer_tax_code),
        total_pre_tax = VALUES(total_pre_tax),
        total_tax = VALUES(total_tax),
        total_amount = VALUES(total_amount),
        status = VALUES(status),
        payload_json = VALUES(payload_json);
    `;
    await query(sql, [
      invoice.id, invoice.template_code, invoice.invoice_series, invoice.created_date,
      invoice.buyer_name, invoice.buyer_legal_name, invoice.buyer_tax_code,
      invoice.total_pre_tax, invoice.total_tax, invoice.total_amount,
      invoice.currency_code, invoice.status, invoice.payload_json
    ]);
  }

  /**
   * Update the status of an invoice
   */
  static async updateStatus(id: string, status: string): Promise<void> {
    await query('UPDATE invoices SET status = ? WHERE id = ?', [status, id]);
  }
}
