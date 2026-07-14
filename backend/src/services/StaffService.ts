// ============================================================
// StaffService — Business logic for staff management
// ============================================================
import { StaffRepository } from '../repositories/StaffRepository';
import { BadRequestException } from '../exceptions/BadRequestException';
import { NotFoundException } from '../exceptions/NotFoundException';

export class StaffService {
  static async getAll() {
    return StaffRepository.findAll();
  }

  static async getById(id: string) {
    const staff = await StaffRepository.findById(id);
    if (!staff) throw new NotFoundException(`Staff ${id} not found`);
    return staff;
  }

  static async createOrUpdate(data: any) {
    if (!data.name || !data.email || !data.role) {
      throw new BadRequestException('Name, email, and role are required');
    }

    const id = data.id || `S-${Math.floor(100 + Math.random() * 900)}`;
    const entity = {
      id,
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: data.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(data.name)}`,
      status: data.status || 'active',
      checked_in_at: data.checked_in_at || null,
      checked_out_at: data.checked_out_at || null
    };

    await StaffRepository.save(entity);
    return entity;
  }

  static async checkIn(id: string) {
    const staff = await StaffRepository.findById(id);
    if (!staff) throw new NotFoundException(`Staff ${id} not found`);
    const timeNow = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    await StaffRepository.updateAttendance(id, timeNow, staff.checked_out_at);
    return { id, checked_in_at: timeNow };
  }

  static async checkOut(id: string) {
    const staff = await StaffRepository.findById(id);
    if (!staff) throw new NotFoundException(`Staff ${id} not found`);
    const timeNow = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    await StaffRepository.updateAttendance(id, staff.checked_in_at, timeNow);
    return { id, checked_out_at: timeNow };
  }

  static async updateStatus(id: string, status: string) {
    if (!id) throw new BadRequestException('Staff ID is required');
    await StaffRepository.updateStatus(id, status);
    return { id, status };
  }

  static async deleteStaff(id: string) {
    if (!id) throw new BadRequestException('Staff ID is required');
    await StaffRepository.delete(id);
  }
}
