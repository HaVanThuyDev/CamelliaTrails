import { TourRepository } from '../repositories/TourRepository';
import { BadRequestException } from '../exceptions/BadRequestException';
import { TourEntity } from '../entities/TourEntity';

export class TourService {
  /**
   * Fetch all tours list
   */
  static async getTours(): Promise<TourEntity[]> {
    return TourRepository.findAll();
  }

  /**
   * Save a tour package details (creates new or updates existing)
   */
  static async saveTour(data: any): Promise<TourEntity> {
    const { id, title, location, duration, price, maxGuests, description, image, rating, featured } = data;

    if (!title || !location || !price) {
      throw new BadRequestException('Title, location, and price are required parameters');
    }

    const tourId = id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const entity: TourEntity = {
      id: tourId,
      title,
      location,
      duration: duration || '1 Ngày',
      price: Number(price),
      max_guests: Number(maxGuests || 10),
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1528127269322-539801943592',
      rating: Number(rating || 5.0),
      featured: featured ? 1 : 0
    };

    await TourRepository.save(entity);
    return entity;
  }

  /**
   * Delete a tour package by ID
   */
  static async deleteTour(id: string): Promise<void> {
    if (!id) {
      throw new BadRequestException('Tour ID is required for deletion');
    }
    await TourRepository.delete(id);
  }
}
