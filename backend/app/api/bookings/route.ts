import { NextRequest, NextResponse } from 'next/server';
import { query, initDb } from '../../../lib/db';

let isDbInitialized = false;

async function ensureDb() {
  if (!isDbInitialized) {
    await initDb();
    isDbInitialized = true;
  }
}

export async function GET() {
  try {
    await ensureDb();
    const rows = await query('SELECT * FROM bookings ORDER BY booked_at DESC, id DESC');
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || err }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDb();
    const body = await req.json();
    const { id, tourId, tourTitle, date, guests, totalPrice, status, userEmail, userName, bookedAt } = body;

    const sql = `
      INSERT INTO bookings (id, tour_id, tour_title, date, guests, total_price, status, user_email, user_name, booked_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        status = VALUES(status),
        guests = VALUES(guests),
        total_price = VALUES(total_price);
    `;

    await query(sql, [id, tourId, tourTitle, date, guests, totalPrice, status || 'Đã xác nhận', userEmail, userName, bookedAt]);
    return NextResponse.json({ status: 'success', id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || err }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
