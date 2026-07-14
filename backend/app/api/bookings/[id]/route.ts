import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status } = body;

    await query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
    return NextResponse.json({ status: 'success', message: `Booking ${id} status updated to ${status}` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || err }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
