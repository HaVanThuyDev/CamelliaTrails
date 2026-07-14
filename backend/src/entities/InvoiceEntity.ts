export interface InvoiceEntity {
  id: string;
  template_code: string;
  invoice_series: string;
  created_date: string;
  buyer_name: string;
  buyer_legal_name: string | null;
  buyer_tax_code: string | null;
  total_pre_tax: number;
  total_tax: number;
  total_amount: number;
  currency_code: string;
  status: string;
  payload_json: string; // longtext JSON payload string
}
