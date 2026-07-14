import { NextRequest } from 'next/server';
import { InvoiceController } from '../../../src/controllers/InvoiceController';

export async function GET() {
  return InvoiceController.getInvoices();
}

export async function POST(req: NextRequest) {
  return InvoiceController.submitInvoice(req);
}
