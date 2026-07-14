import { NextRequest, NextResponse } from 'next/server';
import { InvoiceService } from '../services/InvoiceService';
import { HttpException } from '../exceptions/HttpException';

export class InvoiceController {
  /**
   * Fetch all invoices controller
   */
  static async getInvoices() {
    try {
      const invoices = await InvoiceService.listInvoices();
      return NextResponse.json(invoices);
    } catch (err: any) {
      if (err instanceof HttpException) {
        return NextResponse.json({ error: err.message }, { status: err.status });
      }
      return NextResponse.json({ error: err.message || err }, { status: 500 });
    }
  }

  /**
   * Submit invoice controller
   */
  static async submitInvoice(req: NextRequest) {
    try {
      const body = await req.json();
      const result = await InvoiceService.submitInvoice(body);
      return NextResponse.json(result);
    } catch (err: any) {
      if (err instanceof HttpException) {
        return NextResponse.json({ error: err.message }, { status: err.status });
      }
      return NextResponse.json({ error: err.message || err }, { status: 500 });
    }
  }
}
