// ============================================================
// BookingService — Business logic for bookings
// ============================================================
import { BookingRepository } from '../repositories/BookingRepository';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { BadRequestException } from '../exceptions/BadRequestException';
import { NotFoundException } from '../exceptions/NotFoundException';

export class BookingService {
  static async getAll() {
    return BookingRepository.findAll();
  }

  static async getById(id: string) {
    const booking = await BookingRepository.findById(id);
    if (!booking) throw new NotFoundException(`Booking ${id} not found`);
    return booking;
  }

  static async createBooking(data: any) {
    if (!data.tour_id || !data.tour_title || !data.date || !data.guests || !data.total_price) {
      throw new BadRequestException('Missing required booking fields: tour_id, tour_title, date, guests, total_price');
    }

    const id = data.id || `B-${Math.floor(1000 + Math.random() * 9000)}`;
    const entity = {
      id,
      tour_id: data.tour_id,
      tour_title: data.tour_title,
      date: data.date,
      guests: Number(data.guests),
      total_price: Number(data.total_price),
      status: data.status || 'Đã xác nhận',
      user_email: data.user_email || 'guest@tea.com',
      user_name: data.user_name || 'Khách vãng lai',
      booked_at: data.booked_at || new Date().toISOString().split('T')[0]
    };

    await BookingRepository.save(entity);

    // Auto-increment customer spending
    if (data.user_email) {
      await CustomerRepository.incrementBooking(data.user_email, Number(data.total_price))
        .catch(() => {/* customer may not exist yet */});
    }

    return entity;
  }

  static async updateStatus(id: string, status: string) {
    if (!id) throw new BadRequestException('Booking ID is required');
    if (!status) throw new BadRequestException('Status is required');
    await BookingRepository.findById(id).then(b => {
      if (!b) throw new NotFoundException(`Booking ${id} not found`);
    });
    await BookingRepository.updateStatus(id, status);
    return { id, status };
  }

  static async cancelBooking(id: string) {
    return BookingService.updateStatus(id, 'Đã hủy');
  }

  static async deleteBooking(id: string) {
    if (!id) throw new BadRequestException('Booking ID is required');
    await BookingRepository.delete(id);
  }
}
