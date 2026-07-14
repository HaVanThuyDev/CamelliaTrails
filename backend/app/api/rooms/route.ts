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
    const rows = await query('SELECT * FROM rooms ORDER BY id ASC');
    // Parse JSON values for client compatibility
    const parsed = (rows as any[]).map((r: any) => ({
      ...r,
      amenities: JSON.parse(r.amenities || '[]'),
      currentBooking: r.current_booking ? JSON.parse(r.current_booking) : null
    }));
    return NextResponse.json(parsed);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || err }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDb();
    const body = await req.json();
    const { id, name, type, price, status, amenities, image, currentBooking } = body;

    const sql = `
      INSERT INTO rooms (id, name, type, price, status, amenities, image, current_booking)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        type = VALUES(type),
        price = VALUES(price),
        status = VALUES(status),
        amenities = VALUES(amenities),
        image = VALUES(image),
        current_booking = VALUES(current_booking);
    `;

    await query(sql, [
      id, name, type, price, status || 'Available', 
      JSON.stringify(amenities || []), image, 
      currentBooking ? JSON.stringify(currentBooking) : null
    ]);
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
