// ============================================================
// ReviewRepository — CRUD for reviews table
// ============================================================
import { query } from '../../lib/db';

export class ReviewRepository {
  static async findAll(): Promise<any[]> {
    return query('SELECT * FROM reviews ORDER BY created_at DESC') as Promise<any[]>;
  }

  static async findByTourId(tourId: string): Promise<any[]> {
    return query('SELECT * FROM reviews WHERE tour_id = ? ORDER BY created_at DESC', [tourId]) as Promise<any[]>;
  }

  static async save(data: any): Promise<void> {
    await query(
      `INSERT INTO reviews (id, tour_id, tour_name, user_name, user_email, rating, comment, sentiment, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         rating = VALUES(rating),
         comment = VALUES(comment),
         sentiment = VALUES(sentiment)`,
      [
        data.id, data.tour_id, data.tour_name,
        data.user_name, data.user_email,
        data.rating, data.comment,
        data.sentiment || 'neutral',
        data.created_at || new Date().toISOString().split('T')[0]
      ]
    );
  }

  static async updateSentiment(id: string, sentiment: string): Promise<void> {
    await query('UPDATE reviews SET sentiment = ? WHERE id = ?', [sentiment, id]);
  }

  static async delete(id: string): Promise<void> {
    await query('DELETE FROM reviews WHERE id = ?', [id]);
  }

  static async getAverageRating(tourId: string): Promise<number> {
    const rows = await query(
      'SELECT AVG(rating) as avg_rating FROM reviews WHERE tour_id = ?', [tourId]
    ) as any[];
    return parseFloat(rows[0]?.avg_rating) || 0;
  }
}
