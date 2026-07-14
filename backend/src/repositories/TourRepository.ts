import { query } from '../../lib/db';
import { TourEntity } from '../entities/TourEntity';

export class TourRepository {
  /**
   * Find all tours in the catalog
   */
  static async findAll(): Promise<TourEntity[]> {
    const rows = await query('SELECT * FROM tours ORDER BY id DESC');
    return rows as TourEntity[];
  }

  /**
   * Insert or Update a tour package details
   */
  static async save(tour: TourEntity): Promise<void> {
    const sql = `
      INSERT INTO tours (id, title, location, duration, price, max_guests, description, image, rating, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        location = VALUES(location),
        duration = VALUES(duration),
        price = VALUES(price),
        max_guests = VALUES(max_guests),
        description = VALUES(description),
        image = VALUES(image),
        rating = VALUES(rating),
        featured = VALUES(featured);
    `;
    await query(sql, [
      tour.id, tour.title, tour.location, tour.duration, tour.price, 
      tour.max_guests, tour.description, tour.image, tour.rating, tour.featured
    ]);
  }

  /**
   * Remove a tour package from catalog by ID
   */
  static async delete(id: string): Promise<void> {
    await query('DELETE FROM tours WHERE id = ?', [id]);
  }
}
