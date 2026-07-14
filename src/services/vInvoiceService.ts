export interface VInvoiceConfig {
  url: string;
  username?: string;
  password?: string;
}

export interface VInvoicePayloadData {
  generalInfo: {
    invoiceType: string;
    templateCode: string;
    invoiceSeries: string;
    currencyCode: string;
    exchangeRate: number;
    adjustmentType: string;
    paymentStatus: boolean;
    cusGetInvoiceRight: boolean;
  };
  buyerInfo: {
    buyerName: string;
    buyerLegalName: string;
    buyerTaxCode: string;
    buyerAddressLine: string;
    buyerPhoneNumber: string;
    buyerEmail: string;
    buyerIdNo: string;
    buyerIdType: number;
    buyerNotGetInvoice: string;
  };
  paymentMethod: string;
  paymentMethodName: string;
  items: any[];
  invoiceNote: string;
}

export class VInvoiceService {
  private config: VInvoiceConfig;

  constructor(config: VInvoiceConfig) {
    this.config = config;
  }

  /**
   * Reads currency numbers in Vietnamese words
   */
  public static numberToWordsVi(num: number): string {
    if (num === 0) return 'Không đồng';
    const units = ['', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ', ' triệu tỷ'];
    const digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    
    const readGroup3 = (n: number, isFirst: boolean): string => {
      let res = '';
      const h = Math.floor(n / 100);
      const t = Math.floor((n % 100) / 10);
      const u = n % 10;
      
      if (h > 0 || !isFirst) {
        res += digits[h] + ' trăm ';
      }
      
      if (t > 0) {
        if (t === 1) res += 'mười ';
        else res += digits[t] + ' mươi ';
      } else if (h > 0 && u > 0) {
        res += 'lẻ ';
      }
      
      if (t > 0 && u === 5) {
        res += 'lăm ';
      } else if (t > 1 && u === 1) {
        res += 'mốt ';
      } else if (u > 0) {
        res += digits[u] + ' ';
      }
      return res;
    };
    
    let temp = Math.abs(num);
    let words = '';
    let groupIdx = 0;
    
    while (temp > 0) {
      const group = temp % 1000;
      if (group > 0) {
        const groupWords = readGroup3(group, temp < 1000);
        words = groupWords + units[groupIdx] + ' ' + words;
      }
      temp = Math.floor(temp / 1000);
      groupIdx++;
    }
    
    let result = words.trim().replace(/\s+/g, ' ');
    result = result.charAt(0).toUpperCase() + result.slice(1) + ' đồng';
    return result;
  }

  /**
   * Formats the React page form data into the exact Viettel vInvoice API payload schema
   */
  public formatPayload(data: VInvoicePayloadData) {
    let sumOfTotalLineAmountWithoutTax = 0;
    let discountAmount = 0;
    let totalTaxAmount = 0;

    const itemInfo = data.items.map((item, index) => {
      const isGoods = Number(item.selection) === 1;
      const isDiscount = Number(item.selection) === 3;
      const isNote = Number(item.selection) === 2;

      let itemTotalAmountWithoutTax = null;
      let itemTotalAmountAfterDiscount = null;
      let itemTotalAmountWithTax = null;
      let taxAmount = 0;

      if (isGoods) {
        const rawAmount = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
        itemTotalAmountWithoutTax = rawAmount;
        itemTotalAmountAfterDiscount = rawAmount - (Number(item.discount) || 0);

        const taxPct = Number(item.taxPercentage);
        if (taxPct > 0) {
          taxAmount = Math.round((itemTotalAmountAfterDiscount * taxPct) / 100);
        }

        itemTotalAmountWithTax = itemTotalAmountAfterDiscount + taxAmount;
        sumOfTotalLineAmountWithoutTax += itemTotalAmountAfterDiscount;
        totalTaxAmount += taxAmount;
      } else if (isDiscount) {
        const discVal = Number(item.itemTotalAmountWithoutTax) || 0;
        itemTotalAmountWithoutTax = discVal;
        itemTotalAmountAfterDiscount = discVal;
        itemTotalAmountWithTax = discVal;
        discountAmount += discVal;
      } else if (isNote) {
        itemTotalAmountWithoutTax = null;
        itemTotalAmountAfterDiscount = null;
        itemTotalAmountWithTax = null;
      }

      return {
        lineNumber: index + 1,
        selection: Number(item.selection),
        itemCode: item.itemCode || null,
        itemName: item.itemName,
        unitName: isGoods ? item.unitName : null,
        quantity: isGoods ? Number(item.quantity) : null,
        unitPrice: isGoods ? Number(item.unitPrice) : null,
        itemTotalAmountWithoutTax,
        itemTotalAmountAfterDiscount,
        itemTotalAmountWithTax,
        taxPercentage: isNote ? null : Number(item.taxPercentage),
        taxAmount: isNote ? null : taxAmount,
        discount: isGoods ? (Number(item.discount) || null) : null,
        itemDiscount: null,
        itemNote: item.itemNote || null,
        isIncreaseItem: isGoods ? null : false
      };
    });

    const totalAmountWithoutTax = sumOfTotalLineAmountWithoutTax - discountAmount;
    const totalAmountWithTax = totalAmountWithoutTax + totalTaxAmount;

    // Group items by tax percentage for breakdown
    const breakdownMap: { [key: number]: { taxableAmount: number; taxAmount: number } } = {};
    itemInfo.forEach(item => {
      if (item.selection !== 2 && item.taxPercentage !== null) {
        const pct = item.taxPercentage;
        if (!breakdownMap[pct]) {
          breakdownMap[pct] = { taxableAmount: 0, taxAmount: 0 };
        }

        if (item.selection === 1) {
          breakdownMap[pct].taxableAmount += (item.itemTotalAmountAfterDiscount || 0);
          breakdownMap[pct].taxAmount += (item.taxAmount || 0);
        } else if (item.selection === 3) {
          breakdownMap[pct].taxableAmount -= (item.itemTotalAmountWithoutTax || 0);
        }
      }
    });

    const taxBreakdowns = Object.keys(breakdownMap).map(pctStr => {
      const pct = Number(pctStr);
      return {
        taxPercentage: pct,
        taxableAmount: breakdownMap[pct].taxableAmount,
        taxAmount: breakdownMap[pct].taxAmount
      };
    });

    return {
      generalInvoiceInfo: {
        ...data.generalInfo,
        exchangeRate: Number(data.generalInfo.exchangeRate),
        invoiceIssuedDate: null,
        transactionUuid: null
      },
      buyerInfo: {
        ...data.buyerInfo,
        buyerIdType: Number(data.buyerInfo.buyerIdType)
      },
      payments: [
        {
          paymentMethod: data.paymentMethod,
          paymentMethodName: data.paymentMethodName
        }
      ],
      itemInfo,
      taxBreakdowns,
      summarizeInfo: {
        sumOfTotalLineAmountWithoutTax,
        totalAmountAfterDiscount: totalAmountWithoutTax,
        totalAmountWithoutTax,
        totalTaxAmount,
        totalAmountWithTax,
        totalAmountWithTaxInWords: VInvoiceService.numberToWordsVi(totalAmountWithTax),
        discountAmount
      },
      metadata: [
        {
          keyTag: 'invoiceNote',
          stringValue: data.invoiceNote,
          valueType: 'text',
          keyLabel: 'Ghi chú'
        }
      ]
    };
  }

  /**
   * Generates Basic Auth Header token
   */
  public getAuthHeader(): string | null {
    if (this.config.username || this.config.password) {
      const token = btoa(`${this.config.username || ''}:${this.config.password || ''}`);
      return `Basic ${token}`;
    }
    return null;
  }

  public async submitDraft(payload: any): Promise<Response> {
    const backendUrl = 'http://localhost:3001/api/invoices';
    return fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apiConfig: {
          url: this.config.url,
          username: this.config.username,
          password: this.config.password
        },
        invoicePayload: payload
      })
    });
  }
}
