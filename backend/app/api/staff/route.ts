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
    const rows = await query('SELECT * FROM staff ORDER BY id ASC');
    const formatted = (rows as any[]).map((r: any) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      role: r.role,
      avatar: r.avatar,
      status: r.status,
      checkedInAt: r.checked_in_at || null,
      checkedOutAt: r.checked_out_at || null
    }));
    return NextResponse.json(formatted);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || err }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDb();
    const body = await req.json();
    const { id, name, email, role, avatar, status, checkedInAt, checkedOutAt } = body;

    const sql = `
      INSERT INTO staff (id, name, email, role, avatar, status, checked_in_at, checked_out_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        email = VALUES(email),
        role = VALUES(role),
        avatar = VALUES(avatar),
        status = VALUES(status),
        checked_in_at = VALUES(checked_in_at),
        checked_out_at = VALUES(checked_out_at);
    `;

    await query(sql, [id, name, email, role, avatar, status || 'Offline', checkedInAt || null, checkedOutAt || null]);
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
