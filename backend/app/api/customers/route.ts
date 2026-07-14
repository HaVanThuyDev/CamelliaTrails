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
    const rows = await query('SELECT * FROM customers ORDER BY bookings_count DESC, id ASC');
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || err }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDb();
    const body = await req.json();
    const { id, name, email, phone, bookingsCount, status } = body;

    const sql = `
      INSERT INTO customers (id, name, email, phone, bookings_count, status)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        email = VALUES(email),
        phone = VALUES(phone),
        bookings_count = VALUES(bookings_count),
        status = VALUES(status);
    `;

    await query(sql, [id, name, email, phone, bookingsCount || 0, status || 'Active']);
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
