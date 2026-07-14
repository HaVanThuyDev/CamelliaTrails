// =========================================================
// API Client — Centralized fetch wrapper for backend calls
// Base URL: http://localhost:3001/api
// =========================================================

const BASE_URL = 'http://localhost:3001/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API ${endpoint} failed [${res.status}]: ${errorText}`);
  }

  return res.json() as Promise<T>;
}

// ---- Tours ----
export const api = {
  // Tours
  getTours: () => request<any[]>('/tours'),
  createTour: (data: any) =>
    request<any>('/tours', { method: 'POST', body: JSON.stringify(data) }),
  deleteTour: (id: string) =>
    request<void>(`/tours/${id}`, { method: 'DELETE' }),
  updateTour: (id: string, data: any) =>
    request<any>(`/tours/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Bookings
  getBookings: () => request<any[]>('/bookings'),
  createBooking: (data: any) =>
    request<any>('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  cancelBooking: (id: string) =>
    request<any>(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'Đã hủy' }),
    }),

  // Staff
  getStaff: () => request<any[]>('/staff'),
  createStaff: (data: any) =>
    request<any>('/staff', { method: 'POST', body: JSON.stringify(data) }),
  updateStaff: (id: string, data: any) =>
    request<any>('/staff', {
      method: 'PATCH',
      body: JSON.stringify({ id, ...data }),
    }),

  // Rooms
  getRooms: () => request<any[]>('/rooms'),
  createRoom: (data: any) =>
    request<any>('/rooms', { method: 'POST', body: JSON.stringify(data) }),
  updateRoom: (id: string, data: any) =>
    request<any>('/rooms', {
      method: 'PATCH',
      body: JSON.stringify({ id, ...data }),
    }),

  // Customers
  getCustomers: () => request<any[]>('/customers'),

  // Transactions
  getTransactions: () => request<any[]>('/transactions'),
  createTransaction: (data: any) =>
    request<any>('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  refundTransaction: (id: string) =>
    request<any>('/transactions', {
      method: 'PATCH',
      body: JSON.stringify({ id, status: 'Refunded' }),
    }),

  // Audit Logs
  getAuditLogs: () => request<any[]>('/audit-logs'),
  createLog: (data: any) =>
    request<any>('/audit-logs', { method: 'POST', body: JSON.stringify(data) }),

  // Reviews
  getReviews: () => request<any[]>('/reviews'),

  // Invoices
  getInvoices: () => request<any[]>('/invoices'),
  createInvoice: (data: any) =>
    request<any>('/invoices', { method: 'POST', body: JSON.stringify(data) }),
};
