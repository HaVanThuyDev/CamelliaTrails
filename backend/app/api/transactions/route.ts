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
    const rows = await query('SELECT * FROM transactions ORDER BY date DESC, id DESC');
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || err }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDb();
    const body = await req.json();
    const { id, date, amount, method, status, customer } = body;

    const sql = `
      INSERT INTO transactions (id, date, amount, method, status, customer)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        status = VALUES(status);
    `;

    await query(sql, [id, date, amount, method, status || 'Completed', customer]);
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
