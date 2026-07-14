import { InvoiceRepository } from '../repositories/InvoiceRepository';
import { BadRequestException } from '../exceptions/BadRequestException';
import { InvoiceEntity } from '../entities/InvoiceEntity';

export class InvoiceService {
  /**
   * List all stored invoice drafts
   */
  static async listInvoices(): Promise<InvoiceEntity[]> {
    return InvoiceRepository.findAll();
  }

  /**
   * Save draft invoice details locally and forward to Viettel vInvoice system
   */
  static async submitInvoice(body: any) {
    const { apiConfig, invoicePayload } = body;

    if (!invoicePayload) {
      throw new BadRequestException('invoicePayload is required');
    }

    const id = invoicePayload.generalInvoiceInfo?.transactionUuid || `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const template_code = invoicePayload.generalInvoiceInfo?.templateCode || '2/LKD3';
    const invoice_series = invoicePayload.generalInvoiceInfo?.invoiceSeries || 'C26MTM';
    const created_date = new Date().toISOString().split('T')[0];
    const buyer_name = invoicePayload.buyerInfo?.buyerName || 'khách hàng a';
    const buyer_legal_name = invoicePayload.buyerInfo?.buyerLegalName || null;
    const buyer_tax_code = invoicePayload.buyerInfo?.buyerTaxCode || null;
    
    const total_pre_tax = Number(invoicePayload.summarizeInfo?.totalAmountWithoutTax) || 0;
    const total_tax = Number(invoicePayload.summarizeInfo?.totalTaxAmount) || 0;
    const total_amount = Number(invoicePayload.summarizeInfo?.totalAmountWithTax) || 0;
    const currency_code = invoicePayload.generalInvoiceInfo?.currencyCode || 'VND';
    const initialStatus = 'Chưa phát hành';
    const payload_json = JSON.stringify(invoicePayload);

    const entity: InvoiceEntity = {
      id, template_code, invoice_series, created_date, buyer_name, buyer_legal_name, buyer_tax_code,
      total_pre_tax, total_tax, total_amount, currency_code, status: initialStatus, payload_json
    };

    // Save locally
    await InvoiceRepository.save(entity);

    // Forward to Viettel if configured and simulation is disabled
    if (apiConfig && apiConfig.url && !apiConfig.useSimulation) {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (apiConfig.username && apiConfig.password) {
        const token = Buffer.from(`${apiConfig.username}:${apiConfig.password}`).toString('base64');
        headers['Authorization'] = `Basic ${token}`;
      }

      console.log(`>>> Service: forwarding invoice ${id} to Viettel API`);

      try {
        const response = await fetch(apiConfig.url, {
          method: 'POST',
          headers,
          body: payload_json
        });

        const text = await response.text();
        let resData;
        try {
          resData = JSON.parse(text);
        } catch (e) {
          resData = text;
        }

        if (response.ok) {
          await InvoiceRepository.updateStatus(id, 'Đã phát hành');
          return {
            status: 'success',
            viettelResponse: resData,
            dbId: id
          };
        } else {
          await InvoiceRepository.updateStatus(id, 'Lỗi phát hành');
          return {
            status: 'error',
            error: 'Viettel API returned error code',
            viettelResponse: resData,
            dbId: id
          };
        }
      } catch (err: any) {
        await InvoiceRepository.updateStatus(id, 'Lỗi kết nối');
        return {
          status: 'error',
          error: `Connection failure: ${err.message || err}`,
          dbId: id
        };
      }
    }

    // Simulation Mode Mock response
    return {
      status: 'simulated_success',
      errorCode: '00',
      description: 'Tạo hóa đơn nháp thành công (Giả lập Backend Monolithic)',
      result: {
        invoiceId: id,
        invoiceNo: `0000${Math.floor(100 + Math.random() * 900)}`,
        reservationCode: `RES-${Math.floor(100000 + Math.random() * 900000)}`,
        issuedDate: new Date().toISOString()
      },
      dbId: id
    };
  }
}
