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
    const rows = await query('SELECT * FROM audit_logs ORDER BY timestamp DESC, id DESC');
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || err }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDb();
    const body = await req.json();
    const { user, action, details } = body;

    const sql = `
      INSERT INTO audit_logs (user, action, details)
      VALUES (?, ?, ?);
    `;

    await query(sql, [user || 'System', action, details]);
    return NextResponse.json({ status: 'success' });
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
