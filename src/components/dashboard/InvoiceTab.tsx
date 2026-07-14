import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { VInvoiceService } from '../../services/vInvoiceService';
import {
  Receipt, Search, Plus, Trash2, Send, Terminal, Eye, EyeOff, Copy,
  FileCode, AlertCircle, ChevronDown, ChevronUp, FileSpreadsheet, Play,
  X, RefreshCw, Globe, Shield
} from 'lucide-react';

interface InvoiceDraftRow {
  stt: number;
  id: string;
  templateCode: string;
  invoiceSeries: string;
  createdDate: string;
  buyerName: string;
  buyerLegalName: string;
  buyerTaxCode: string;
  totalPreTax: number;
  totalTax: number;
  totalAmount: number;
  currencyCode: string;
  status: string;
}

export const InvoiceTab: React.FC = () => {
  const { addLog, addNotification } = useDashboard();

  // Active view: 'list' (Danh sách hóa đơn) or 'create' (Lập hóa đơn nháp)
  const [view, setView] = useState<'list' | 'create'>('list');

  // Search parameters (List view)
  const [searchParams, setSearchParams] = useState({
    templateCode: '',
    invoiceSeries: '',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0]
  });

  const [isSearchCollapsed, setIsSearchCollapsed] = useState(false);
  const [isApiConfigCollapsed, setIsApiConfigCollapsed] = useState(true);

  // Invoices list state
  const [draftInvoices, setDraftInvoices] = useState<InvoiceDraftRow[]>(() => {
    const saved = localStorage.getItem('vinvoice_draft_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* ignore */ }
    }
    return [
      {
        stt: 1,
        id: 'DRAFT-001',
        templateCode: '2/LKD3',
        invoiceSeries: 'C26MTM',
        createdDate: '2026-07-14',
        buyerName: 'khách hàng a',
        buyerLegalName: 'Công ty TNHH Giải Pháp Phần Mềm A',
        buyerTaxCode: '0109283746',
        totalPreTax: 10000,
        totalTax: 0,
        totalAmount: 10000,
        currencyCode: 'VND',
        status: 'Chưa phát hành'
      },
      {
        stt: 2,
        id: 'DRAFT-002',
        templateCode: '2/LKD3',
        invoiceSeries: 'C26MTM',
        createdDate: '2026-07-13',
        buyerName: 'Nguyễn Văn B',
        buyerLegalName: '',
        buyerTaxCode: '',
        totalPreTax: 250000,
        totalTax: 20000,
        totalAmount: 270000,
        currencyCode: 'VND',
        status: 'Chưa phát hành'
      }
    ];
  });

  // Sync draft list to localStorage
  useEffect(() => {
    localStorage.setItem('vinvoice_draft_list', JSON.stringify(draftInvoices));
  }, [draftInvoices]);

  // Selected list rows checkboxes
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // API Configuration
  const [apiConfig, setApiConfig] = useState(() => {
    const saved = localStorage.getItem('vinvoice_api_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          useSimulation: parsed.useSimulation !== undefined ? parsed.useSimulation : false
        };
      } catch (e) { /* ignore */ }
    }
    return {
      url: 'https://api-vinvoice.viettel.vn/services/einvoiceapplication/api/InvoiceAPI/InvoiceWS/createOrUpdateInvoiceDraft/0100109106-507',
      username: '',
      password: '',
      useSimulation: false
    };
  });

  // Sync API config to localStorage
  useEffect(() => {
    localStorage.setItem('vinvoice_api_config', JSON.stringify(apiConfig));
  }, [apiConfig]);

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  // Form: Customer Info
  const [buyerInfo, setBuyerInfo] = useState({
    sellToConsumer: false,
    buyerName: '',
    buyerCode: '',
    buyerAddressLine: '',
    buyerLegalName: '',
    buyerTaxCode: '',
    contractNo: '',
    buyerPhoneNumber: '',
    buyerEmail: '',
    buyerIdType: 2, // 2: CCCD
    buyerIdNo: '',
    bankName: '',
    bankAccountNo: '',
    budgetRelationCode: '',
    buyerNotGetInvoice: '0'
  });

  // Form: Invoice Info
  const [invoiceInfo, setInvoiceInfo] = useState({
    shopCode: '',
    shopName: '',
    businessLocationCode: '',
    businessLocationName: '',
    businessLocationAddress: '',
    paymentMethod: '2', // 2: CK, 1: TM
    paymentMethodDetail: 'CK',
    currencyCode: 'VND',
    exchangeRate: 1,
    templateCode: '2/LKD3',
    invoiceSeries: 'C26MTM',
    ledgerNo: '',
    ledgerDate: '',
    numberOfCopies: 1
  });

  // Form: Items
  const [items, setItems] = useState<any[]>([
    {
      id: 'item-1',
      lineNumber: 1,
      selection: 1, // 1: Goods, 2: Note, 3: Discount
      itemName: '',
      itemCode: '',
      unitName: 'cái',
      quantity: 1,
      unitPrice: 0,
      taxPercentage: -2,
      discount: 0,
      itemNote: '',
      itemTotalAmountWithoutTax: 0
    }
  ]);

  const [invoiceNote, setInvoiceNote] = useState('');


  
  // Console state
  const [activeConsoleTab, setActiveConsoleTab] = useState<'payload' | 'console'>('payload');
  const [consoleLogs, setConsoleLogs] = useState<string>('// API Terminal ready.\n// Click "Lập hóa đơn nháp" to view request/response logs.');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Sync payments methods details
  useEffect(() => {
    setInvoiceInfo(prev => ({
      ...prev,
      paymentMethodDetail: prev.paymentMethod === '2' ? 'CK' : prev.paymentMethod === '1' ? 'TM' : 'TM/CK'
    }));
  }, [invoiceInfo.paymentMethod]);

  // Load Prefill from SessionStorage
  useEffect(() => {
    const cached = sessionStorage.getItem('prefill_invoice_booking');
    if (cached) {
      try {
        const b = JSON.parse(cached);
        setBuyerInfo(prev => ({
          ...prev,
          buyerName: b.userName || '',
          buyerEmail: b.userEmail || '',
          buyerAddressLine: 'Hà Nội',
          sellToConsumer: false
        }));

        setItems([
          {
            id: String(Date.now()),
            lineNumber: 1,
            selection: 1,
            itemCode: b.tourId || '',
            itemName: b.tourTitle || 'Tour dã ngoại',
            unitName: 'vé',
            quantity: b.guests || 1,
            unitPrice: Math.round((b.totalPrice || 20000) / (b.guests || 1)),
            taxPercentage: -2,
            discount: 0,
            itemNote: `Mã đặt chỗ: ${b.id}`,
            itemTotalAmountWithoutTax: b.totalPrice || 20000
          }
        ]);

        setView('create'); // Open form
        addNotification(
          'Xuất dữ liệu hóa đơn',
          `Đã tải thông tin từ booking ${b.id} của du khách ${b.userName}.`,
          'success'
        );
      } catch (e) {
        console.error('Failed to parse prefilled booking:', e);
      } finally {
        sessionStorage.removeItem('prefill_invoice_booking');
      }
    }
  }, [view]);

  // Handle Item modification
  const handleItemChange = (id: string, field: string, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'selection') {
          const selectType = Number(value);
          if (selectType === 1) { // Goods
            updated.quantity = 1;
            updated.unitPrice = 0;
            updated.taxPercentage = -2;
            updated.discount = 0;
            updated.unitName = 'cái';
          } else if (selectType === 3) { // Discount
            updated.quantity = null;
            updated.unitPrice = null;
            updated.taxPercentage = -2;
            updated.discount = null;
            updated.unitName = null;
            updated.itemTotalAmountWithoutTax = 10000;
          } else { // Note
            updated.quantity = null;
            updated.unitPrice = null;
            updated.taxPercentage = null;
            updated.discount = null;
            updated.unitName = null;
            updated.itemTotalAmountWithoutTax = null;
          }
        }
        return updated;
      }
      return item;
    }));
  };

  // Add line to items table
  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: String(Date.now()),
        lineNumber: prev.length + 1,
        selection: 1,
        itemName: '',
        itemCode: '',
        unitName: 'cái',
        quantity: 1,
        unitPrice: 0,
        taxPercentage: -2,
        discount: 0,
        itemNote: '',
        itemTotalAmountWithoutTax: 0
      }
    ]);
  };

  // Delete line
  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      alert('Chi tiết hóa đơn phải có ít nhất 1 mặt hàng.');
      return;
    }
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Calculate pricing math
  const getTotals = () => {
    let sumOfTotalLineAmountWithoutTax = 0;
    let discountAmount = 0;
    let totalTaxAmount = 0;

    items.forEach(item => {
      const select = Number(item.selection);
      if (select === 1) {
        const raw = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
        const sub = raw - (Number(item.discount) || 0);
        sumOfTotalLineAmountWithoutTax += sub;

        const taxPct = Number(item.taxPercentage);
        if (taxPct > 0) {
          totalTaxAmount += Math.round((sub * taxPct) / 100);
        }
      } else if (select === 3) {
        discountAmount += Number(item.itemTotalAmountWithoutTax) || 0;
      }
    });

    const totalAmountWithoutTax = sumOfTotalLineAmountWithoutTax - discountAmount;
    const totalAmountWithTax = totalAmountWithoutTax + totalTaxAmount;

    return {
      sumOfTotalLineAmountWithoutTax,
      discountAmount,
      totalAmountWithoutTax,
      totalTaxAmount,
      totalAmountWithTax,
      totalAmountWithTaxInWords: VInvoiceService.numberToWordsVi(totalAmountWithTax)
    };
  };

  const totals = getTotals();

  // Create payload object
  const buildPayload = () => {
    const service = new VInvoiceService(apiConfig);
    return service.formatPayload({
      generalInfo: {
        invoiceType: '1',
        templateCode: invoiceInfo.templateCode,
        invoiceSeries: invoiceInfo.invoiceSeries,
        currencyCode: invoiceInfo.currencyCode,
        exchangeRate: Number(invoiceInfo.exchangeRate) || 1,
        adjustmentType: '1',
        paymentStatus: true,
        cusGetInvoiceRight: true
      },
      buyerInfo: {
        buyerName: buyerInfo.buyerName,
        buyerLegalName: buyerInfo.buyerLegalName,
        buyerTaxCode: buyerInfo.buyerTaxCode,
        buyerAddressLine: buyerInfo.buyerAddressLine,
        buyerPhoneNumber: buyerInfo.buyerPhoneNumber,
        buyerEmail: buyerInfo.buyerEmail,
        buyerIdNo: buyerInfo.buyerIdNo,
        buyerIdType: Number(buyerInfo.buyerIdType) || 2,
        buyerNotGetInvoice: buyerInfo.buyerNotGetInvoice
      },
      paymentMethod: invoiceInfo.paymentMethod,
      paymentMethodName: invoiceInfo.paymentMethodDetail,
      items,
      invoiceNote
    });
  };

  // Pre-fill Sample
  const handleLoadSample = () => {
    setBuyerInfo({
      sellToConsumer: false,
      buyerName: 'khách hàng a',
      buyerCode: 'KH-0092',
      buyerAddressLine: 'Ha noi',
      buyerLegalName: 'Công ty TNHH Đầu tư & Phát triển A',
      buyerTaxCode: '0100109106',
      contractNo: 'HD-992-2026',
      buyerPhoneNumber: '0988776655',
      buyerEmail: 'vinvoicesp@gmail.com',
      buyerIdType: 2,
      buyerIdNo: '09099887734',
      bankName: 'Vietcombank',
      bankAccountNo: '1022394857',
      budgetRelationCode: '',
      buyerNotGetInvoice: '0'
    });

    setInvoiceInfo({
      shopCode: 'CN-HN',
      shopName: 'Chi nhánh Hà Nội',
      businessLocationCode: 'ĐD-HN',
      businessLocationName: 'Điểm kinh doanh Hoàn Kiếm',
      businessLocationAddress: 'Hoàn Kiếm, Hà Nội',
      paymentMethod: '2',
      paymentMethodDetail: 'CK',
      currencyCode: 'VND',
      exchangeRate: 1,
      templateCode: '2/LKD3',
      invoiceSeries: 'C26MTM',
      ledgerNo: 'BK-092-26',
      ledgerDate: '2026-07-14',
      numberOfCopies: 1
    });

    setItems([
      {
        id: 'sample-g-1',
        lineNumber: 1,
        selection: 1,
        itemCode: 'SP-101',
        itemName: 'goods 1',
        unitName: 'cái',
        quantity: 1,
        unitPrice: 20000,
        taxPercentage: -2,
        discount: 0,
        itemNote: null,
        itemTotalAmountWithoutTax: 20000
      },
      {
        id: 'sample-d-1',
        lineNumber: 2,
        selection: 3,
        itemCode: '',
        itemName: 'discount for the whole bill',
        unitName: null,
        quantity: null,
        unitPrice: null,
        taxPercentage: -2,
        discount: null,
        itemNote: null,
        itemTotalAmountWithoutTax: 10000
      },
      {
        id: 'sample-n-1',
        lineNumber: 3,
        selection: 2,
        itemCode: '',
        itemName: 'notes in the goods table',
        unitName: null,
        quantity: null,
        unitPrice: null,
        taxPercentage: null,
        discount: null,
        itemNote: null,
        itemTotalAmountWithoutTax: null
      }
    ]);

    setInvoiceNote('Hóa đơn nháp lập mẫu từ hệ thống.');
    addNotification('Tải dữ liệu mẫu', 'Đã tải bộ dữ liệu mẫu vInvoice thành công.', 'info');
  };

  // Submit Draft Invoice
  const handleCreateDraft = async () => {
    if (!buyerInfo.buyerName) {
      alert('Vui lòng điền Tên người mua.');
      return;
    }
    if (!items[0].itemName) {
      alert('Vui lòng điền tên hàng hóa ở dòng 1.');
      return;
    }

    const payload = buildPayload();
    const payloadStr = JSON.stringify(payload, null, 2);

    setIsLoading(true);
    setActiveConsoleTab('console');

    const service = new VInvoiceService(apiConfig);
    const authString = service.getAuthHeader() || 'Basic [NO_CREDENTIALS]';

    let logContent = `>>> KHỞI CHẠY TIẾN TRÌNH TRUYỀN HÓA ĐƠN DRAFT...\n`;
    logContent += `Phương thức: POST\n`;
    logContent += `API URL: ${apiConfig.url}\n`;
    logContent += `Headers:\n  Content-Type: application/json\n  Authorization: ${authString.substring(0, 15)}...\n\n`;
    logContent += `Body:\n${payloadStr}\n\n`;

    setConsoleLogs(logContent);

    const invoiceId = `INV-${Math.floor(100000 + Math.random() * 900000)}`;

    if (apiConfig.useSimulation) {
      // Simulate API call
      setTimeout(() => {
        const mockResponse = {
          errorCode: '00',
          description: 'Tạo hóa đơn nháp thành công',
          result: {
            invoiceId,
            invoiceNo: `0000${Math.floor(100 + Math.random() * 900)}`,
            reservationCode: `RES-${Math.floor(100000 + Math.random() * 900000)}`,
            issuedDate: new Date().toISOString()
          }
        };

        logContent += `<<< PHẢN HỒI GIẢ LẬP (SIMULATION RESPONSE):\n`;
        logContent += `HTTP Status: 200 OK\n`;
        logContent += `Body:\n${JSON.stringify(mockResponse, null, 2)}\n\n`;
        logContent += `>>> Thành công: Hóa đơn nháp được tạo!`;

        setConsoleLogs(logContent);
        setIsLoading(false);

        // Add to rows state
        const newDraftRow: InvoiceDraftRow = {
          stt: draftInvoices.length + 1,
          id: invoiceId,
          templateCode: invoiceInfo.templateCode,
          invoiceSeries: invoiceInfo.invoiceSeries,
          createdDate: new Date().toISOString().split('T')[0],
          buyerName: buyerInfo.buyerName,
          buyerLegalName: buyerInfo.buyerLegalName,
          buyerTaxCode: buyerInfo.buyerTaxCode,
          totalPreTax: totals.totalAmountWithoutTax,
          totalTax: totals.totalTaxAmount,
          totalAmount: totals.totalAmountWithTax,
          currencyCode: invoiceInfo.currencyCode,
          status: 'Chưa phát hành'
        };

        setDraftInvoices(prev => [newDraftRow, ...prev]);
        addLog('Tạo hóa đơn vInvoice (Tab)', `Tạo hóa đơn nháp thành công cho ${buyerInfo.buyerName}. Mã hóa đơn: ${invoiceId}`);
        addNotification('vInvoice Thành công', `Đã lập hóa đơn nháp cho ${buyerInfo.buyerName}`, 'success');
        setView('list'); // Redirect to list
      }, 1000);
      return;
    }

    try {
      const response = await service.submitDraft(payload);
      const responseText = await response.text();
      let parsedBody;
      try {
        parsedBody = JSON.parse(responseText);
      } catch (e) {
        parsedBody = responseText;
      }

      logContent += `<<< PHẢN HỒI TỪ HỆ THỐNG VIETTEL:\n`;
      logContent += `HTTP Status: ${response.status} ${response.statusText}\n`;
      logContent += `Body:\n${typeof parsedBody === 'object' ? JSON.stringify(parsedBody, null, 2) : parsedBody}\n\n`;

      if (response.ok) {
        logContent += `>>> Kết quả: Hoàn thành cuộc gọi API vInvoice!`;
        setConsoleLogs(logContent);
        
        // Add to draft rows state
        const newDraftRow: InvoiceDraftRow = {
          stt: draftInvoices.length + 1,
          id: parsedBody?.result?.invoiceId || invoiceId,
          templateCode: invoiceInfo.templateCode,
          invoiceSeries: invoiceInfo.invoiceSeries,
          createdDate: new Date().toISOString().split('T')[0],
          buyerName: buyerInfo.buyerName,
          buyerLegalName: buyerInfo.buyerLegalName,
          buyerTaxCode: buyerInfo.buyerTaxCode,
          totalPreTax: totals.totalAmountWithoutTax,
          totalTax: totals.totalTaxAmount,
          totalAmount: totals.totalAmountWithTax,
          currencyCode: invoiceInfo.currencyCode,
          status: 'Chưa phát hành'
        };
        setDraftInvoices(prev => [newDraftRow, ...prev]);

        addLog('Tạo hóa đơn vInvoice (API)', `Lập hóa đơn nháp trực tiếp thành công cho ${buyerInfo.buyerName}. Mã: ${invoiceId}`);
        addNotification('vInvoice Thành công', `Đã lập hóa đơn nháp thành công trên hệ thống Viettel!`, 'success');
        setView('list');
      } else {
        logContent += `>>> Kết quả: API trả về lỗi xử lý.`;
        setConsoleLogs(logContent);
        addNotification('vInvoice Thất bại', `API trả về lỗi ${response.status}`, 'error');
        setActiveConsoleTab('console');
        setShowPreviewModal(true);
      }
    } catch (err: any) {
      logContent += `<<< LỖI KẾT NỐI (CONNECTION ERROR):\n`;
      logContent += `Chi tiết: ${err.message || err}\n\n`;
      logContent += `⚠️ CẢNH BÁO CORS (CROSS-ORIGIN RESOURCE SHARING):\n`;
      logContent += `Yêu cầu bị chặn do chính sách CORS. Bạn có thể sử dụng Simulation Mode hoặc copy lệnh curl sau:\n\n`;
      
      const curlCmd = `curl -X POST "${apiConfig.url}" \\\n` +
                      `  -H "Content-Type: application/json" \\\n` +
                      `  -H "Authorization: ${authString}" \\\n` +
                      `  -d '${payloadStr.replace(/'/g, "'\\''")}'`;
      logContent += curlCmd;
      setConsoleLogs(logContent);

      addNotification('Lỗi kết nối API', `Trình duyệt chặn kết nối API Viettel. Xem tab Console Log.`, 'warning');
      setActiveConsoleTab('console');
      setShowPreviewModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle selection row checkbox
  const handleToggleRow = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleToggleAllRows = () => {
    if (selectedRows.length === draftInvoices.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(draftInvoices.map(row => row.id));
    }
  };

  // Delete draft rows
  const handleDeleteDrafts = () => {
    if (selectedRows.length === 0) {
      alert('Vui lòng chọn ít nhất một hóa đơn để xóa.');
      return;
    }
    if (window.confirm(`Xác nhận xóa ${selectedRows.length} hóa đơn nháp đã chọn?`)) {
      setDraftInvoices(prev => prev.filter(row => !selectedRows.includes(row.id)));
      setSelectedRows([]);
      addNotification('Xóa hóa đơn nháp', `Đã xóa hóa đơn nháp thành công.`, 'info');
    }
  };

  // Publish selected draft invoices to Viettel
  const handlePublishSelected = async () => {
    if (selectedRows.length === 0) {
      alert('Vui lòng chọn ít nhất một hóa đơn để phát hành.');
      return;
    }

    if (!window.confirm(`Xác nhận truyền ${selectedRows.length} hóa đơn đã chọn sang hệ thống Viettel vInvoice?`)) {
      return;
    }

    setIsLoading(true);
    let successCount = 0;
    let failCount = 0;
    let logContent = `>>> KHỞI CHẠY TRUYỀN DỮ LIỆU ĐỒNG LOẠT (${selectedRows.length} HÓA ĐƠN)...\n\n`;

    const service = new VInvoiceService(apiConfig);

    for (const id of selectedRows) {
      const row = draftInvoices.find(r => r.id === id);
      if (!row) continue;

      logContent += `--------------------------------------------------\n`;
      logContent += `Đang truyền hóa đơn: ${row.id} - Khách hàng: ${row.buyerName}\n`;

      const payload = service.formatPayload({
        generalInfo: {
          invoiceType: '1',
          templateCode: row.templateCode,
          invoiceSeries: row.invoiceSeries,
          currencyCode: row.currencyCode,
          exchangeRate: 1,
          adjustmentType: '1',
          paymentStatus: true,
          cusGetInvoiceRight: true
        },
        buyerInfo: {
          buyerName: row.buyerName,
          buyerLegalName: row.buyerLegalName || '',
          buyerTaxCode: row.buyerTaxCode || '',
          buyerAddressLine: 'Hà Nội',
          buyerPhoneNumber: '',
          buyerEmail: 'vinvoicesp@gmail.com',
          buyerIdNo: '',
          buyerIdType: 2,
          buyerNotGetInvoice: '0'
        },
        paymentMethod: '2', // CK
        paymentMethodName: 'CK',
        items: [
          {
            lineNumber: 1,
            selection: 1,
            itemName: 'Khai báo dịch vụ du lịch & lữ hành CamelliaTrails',
            unitName: 'gói',
            quantity: 1,
            unitPrice: row.totalPreTax,
            taxPercentage: row.totalTax > 0 ? 8 : -2,
            discount: 0,
            itemNote: `Truyền từ hàng đợi danh sách nháp. Mã đơn gốc: ${row.id}`,
            itemTotalAmountWithoutTax: row.totalPreTax
          }
        ],
        invoiceNote: 'Hóa đơn phát hành từ danh sách quản lý.'
      });

      if (apiConfig.useSimulation) {
        logContent += `[MÔ PHỎ	] Gửi dữ liệu thành công cho ${row.id}.\n`;
        successCount++;
        setDraftInvoices(prev => prev.map(r => r.id === id ? { ...r, status: 'Đã phát hành' } : r));
      } else {
        try {
          const response = await service.submitDraft(payload);
          const responseText = await response.text();
          if (response.ok) {
            logContent += `[API VIETTEL] Thành công. Response: ${responseText}\n`;
            successCount++;
            setDraftInvoices(prev => prev.map(r => r.id === id ? { ...r, status: 'Đã phát hành' } : r));
          } else {
            logContent += `[API VIETTEL] Lỗi từ Viettel: ${response.status} - Response: ${responseText}\n`;
            failCount++;
          }
        } catch (err: any) {
          logContent += `[API VIETTEL] Lỗi kết nối CORS/Mạng: ${err.message || err}\n`;
          failCount++;
        }
      }
    }

    logContent += `\n==================================================\n`;
    logContent += `KẾT QUẢ TRUYỀN DỮ LIỆU:\n`;
    logContent += `- Thành công: ${successCount}\n`;
    logContent += `- Thất bại: ${failCount}\n`;
    
    if (failCount > 0 && !apiConfig.useSimulation) {
      logContent += `\n⚠️ Lưu ý: Các cuộc gọi thất bại do CORS có thể thực hiện thông qua Curl. Vui lòng kiểm tra Console Log.\n`;
    }

    setConsoleLogs(logContent);
    setIsLoading(false);
    setSelectedRows([]);

    if (failCount === 0) {
      addNotification('Truyền dữ liệu', `Đã truyền thành công ${successCount} hóa đơn sang hệ thống Viettel!`, 'success');
      addLog('Phát hành hóa đơn', `Truyền thành công ${successCount} hóa đơn nháp sang Viettel.`);
    } else {
      addNotification('Truyền dữ liệu', `Đã truyền xong: ${successCount} thành công, ${failCount} thất bại. Xem logs.`, 'warning');
      setActiveConsoleTab('console');
      setShowPreviewModal(true);
    }
  };

  // Clear Form Inputs
  const handleClearForm = () => {
    if (window.confirm('Bạn muốn xóa toàn bộ dữ liệu đang nhập?')) {
      setBuyerInfo({
        sellToConsumer: false,
        buyerName: '',
        buyerCode: '',
        buyerAddressLine: '',
        buyerLegalName: '',
        buyerTaxCode: '',
        contractNo: '',
        buyerPhoneNumber: '',
        buyerEmail: '',
        buyerIdType: 2,
        buyerIdNo: '',
        bankName: '',
        bankAccountNo: '',
        budgetRelationCode: '',
        buyerNotGetInvoice: '0'
      });

      setInvoiceInfo({
        shopCode: '',
        shopName: '',
        businessLocationCode: '',
        businessLocationName: '',
        businessLocationAddress: '',
        paymentMethod: '2',
        paymentMethodDetail: 'CK',
        currencyCode: 'VND',
        exchangeRate: 1,
        templateCode: '1/770',
        invoiceSeries: 'K23TXM',
        ledgerNo: '',
        ledgerDate: '',
        numberOfCopies: 1
      });

      setItems([
        {
          id: 'item-1',
          lineNumber: 1,
          selection: 1,
          itemName: '',
          itemCode: '',
          unitName: 'cái',
          quantity: 1,
          unitPrice: 0,
          taxPercentage: -2,
          discount: 0,
          itemNote: '',
          itemTotalAmountWithoutTax: 0
        }
      ]);
      setInvoiceNote('');
    }
  };

  // Copy JSON Payload to clipboard
  const handleCopyJson = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const payloadJson = JSON.stringify(buildPayload(), null, 2);

  return (
    <div className="space-y-6 font-sans">
      
      {/* ========================================================================= */}
      {/* 1. LIST VIEW (Danh sách hóa đơn chưa phát hành) */}
      {/* ========================================================================= */}
      {view === 'list' && (
        <div className="space-y-6 animate-fade-in-up">
          
          {/* Breadcrumb matching layout */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary/50 dark:text-cream/50 uppercase tracking-wider">
            <span className="cursor-pointer hover:text-primary dark:hover:text-cream">Home</span>
            <span>&gt;</span>
            <span className="cursor-pointer hover:text-primary dark:hover:text-cream">Quản lý hóa đơn</span>
            <span>&gt;</span>
            <span className="text-primary dark:text-cream">Quản lý hóa đơn chưa phát hành</span>
          </div>

          {/* Collapsible search card (THÔNG TIN TÌM KIẾM) */}
          <div className="glass rounded-3xl border border-primary/10 overflow-hidden shadow-md">
            <button
              onClick={() => setIsSearchCollapsed(!isSearchCollapsed)}
              className="w-full flex justify-between items-center p-4 md:px-6 bg-[#EBEBE0]/30 dark:bg-dark-surface/30 border-b border-primary/5 text-left text-xs font-extrabold uppercase tracking-wider text-primary dark:text-cream"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-accent" />
                Thông tin tìm kiếm
              </span>
              {isSearchCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            
            {!isSearchCollapsed && (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-primary/70 dark:text-cream/70 sm:text-right">Mẫu hóa đơn</label>
                  <select
                    value={searchParams.templateCode}
                    onChange={(e) => setSearchParams({ ...searchParams, templateCode: e.target.value })}
                    className="sm:col-span-2 bg-cream/45 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-bold"
                  >
                    <option value="">--Lựa chọn--</option>
                    <option value="1/770">1/770</option>
                    <option value="1/001">1/001</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-primary/70 dark:text-cream/70 sm:text-right">Ký hiệu hóa đơn</label>
                  <select
                    value={searchParams.invoiceSeries}
                    onChange={(e) => setSearchParams({ ...searchParams, invoiceSeries: e.target.value })}
                    className="sm:col-span-2 bg-cream/45 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-bold"
                  >
                    <option value="">--Lựa chọn--</option>
                    <option value="K23TXM">K23TXM</option>
                    <option value="C24TAA">C24TAA</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-primary/70 dark:text-cream/70 sm:text-right">Từ ngày</label>
                  <input
                    type="date"
                    value={searchParams.fromDate}
                    onChange={(e) => setSearchParams({ ...searchParams, fromDate: e.target.value })}
                    className="sm:col-span-2 bg-cream/45 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-primary/70 dark:text-cream/70 sm:text-right">Đến ngày</label>
                  <input
                    type="date"
                    value={searchParams.toDate}
                    onChange={(e) => setSearchParams({ ...searchParams, toDate: e.target.value })}
                    className="sm:col-span-2 bg-cream/45 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-mono"
                  />
                </div>

                <div className="md:col-span-2 flex flex-wrap items-center justify-center gap-4 pt-2 border-t border-primary/5 mt-2">
                  <button className="px-5 py-2.5 rounded-xl bg-accent text-primary hover:bg-accent/90 font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer border border-transparent">
                    <Search className="w-4 h-4" /> Tìm kiếm
                  </button>
                  <button className="text-accent font-bold hover:underline cursor-pointer">Tìm kiếm nâng cao</button>
                  <button className="text-accent font-bold hover:underline cursor-pointer">Tìm kiếm log xăng dầu</button>
                  <button className="px-5 py-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary dark:text-cream border border-primary/10 font-bold transition-all flex items-center gap-1.5 cursor-pointer">
                    <FileSpreadsheet className="w-4 h-4" /> Export excel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* List Card panel */}
          <div className="glass rounded-3xl border border-primary/10 overflow-hidden shadow-lg space-y-4 p-4 md:p-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="font-serif text-lg font-bold text-primary dark:text-cream border-l-4 border-accent pl-3">
                Danh sách hóa đơn chưa phát hành
              </h3>

              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
                <button
                  disabled={selectedRows.length === 0}
                  onClick={handlePublishSelected}
                  className={`px-4 py-2.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 shadow-sm transition-all ${
                    selectedRows.length === 0
                      ? 'bg-primary/5 border-primary/10 text-primary/45 dark:text-cream/45 opacity-50 cursor-not-allowed'
                      : 'bg-accent border-transparent text-primary hover:bg-accent/90 cursor-pointer'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" /> Phát hành
                </button>
                <button
                  onClick={() => setView('create')}
                  className="px-4 py-2.5 rounded-xl bg-accent text-primary hover:bg-accent/95 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer border border-transparent"
                >
                  <Plus className="w-3.5 h-3.5" /> Lập hóa đơn
                </button>
                <button className="px-4 py-2.5 rounded-xl bg-[#EBEBE0]/60 dark:bg-dark-surface hover:bg-[#EBEBE0] text-primary dark:text-cream cursor-pointer border border-primary/10">
                  Phát hành nhiều hóa đơn
                </button>
                <button className="px-4 py-2.5 rounded-xl bg-[#EBEBE0]/60 dark:bg-dark-surface hover:bg-[#EBEBE0] text-primary dark:text-cream cursor-pointer border border-primary/10">
                  Import hóa đơn
                </button>
                <button
                  onClick={handleDeleteDrafts}
                  disabled={selectedRows.length === 0}
                  className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-600 dark:text-red-400 disabled:opacity-50 cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa
                </button>
              </div>
            </div>

            {/* Invoices table list */}
            <div className="overflow-x-auto rounded-2xl border border-primary/10">
              <table className="w-full text-left text-xs font-semibold text-primary dark:text-cream border-collapse">
                <thead className="bg-[#EBEBE0]/60 dark:bg-dark-surface/60 text-primary/60 dark:text-cream/60 uppercase border-b border-primary/10">
                  <tr>
                    <th className="p-4 text-center w-12">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === draftInvoices.length && draftInvoices.length > 0}
                        onChange={handleToggleAllRows}
                        className="rounded"
                      />
                    </th>
                    <th className="p-4 text-center">STT</th>
                    <th className="p-4">Mẫu hóa đơn</th>
                    <th className="p-4">Ký hiệu</th>
                    <th className="p-4">Ngày tạo</th>
                    <th className="p-4">Tên người mua</th>
                    <th className="p-4">Tên đơn vị</th>
                    <th className="p-4">Mã số thuế</th>
                    <th className="p-4 text-right">Tổng trước thuế</th>
                    <th className="p-4 text-right">Tiền thuế</th>
                    <th className="p-4 text-right">Tổng tiền</th>
                    <th className="p-4 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5 dark:divide-cream/5">
                  {draftInvoices.length > 0 ? (
                    draftInvoices.map((row) => (
                      <tr key={row.id} className="hover:bg-primary/5 dark:hover:bg-cream/5 transition-colors">
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(row.id)}
                            onChange={() => handleToggleRow(row.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="p-4 text-center font-mono">{row.stt}</td>
                        <td className="p-4 font-mono font-bold text-accent">{row.templateCode}</td>
                        <td className="p-4 font-mono font-bold">{row.invoiceSeries}</td>
                        <td className="p-4 font-mono text-primary/60 dark:text-cream/60">{row.createdDate}</td>
                        <td className="p-4 font-bold">{row.buyerName}</td>
                        <td className="p-4 text-primary/70 dark:text-cream/70 truncate max-w-[150px]">{row.buyerLegalName || '—'}</td>
                        <td className="p-4 font-mono">{row.buyerTaxCode || '—'}</td>
                        <td className="p-4 text-right font-mono">{row.totalPreTax.toLocaleString()}</td>
                        <td className="p-4 text-right font-mono">{row.totalTax.toLocaleString()}</td>
                        <td className="p-4 text-right font-mono font-bold text-accent">{row.totalAmount.toLocaleString()} {row.currencyCode}</td>
                        <td className="p-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={12} className="p-12 text-center text-primary/50 dark:text-cream/50 font-bold italic">
                        Không có dữ liệu hóa đơn nào chưa phát hành.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CREATE VIEW (Lập hóa đơn nháp) */}
      {/* ========================================================================= */}
      {view === 'create' && (
        <div className="space-y-6 animate-fade-in-up">
          
          {/* Breadcrumb matches Screenshot 2 */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary/50 dark:text-cream/50 uppercase tracking-wider">
            <span className="cursor-pointer hover:text-primary dark:hover:text-cream" onClick={() => setView('list')}>Home</span>
            <span>&gt;</span>
            <span className="cursor-pointer hover:text-primary dark:hover:text-cream" onClick={() => setView('list')}>Quản lý hóa đơn</span>
            <span>&gt;</span>
            <span className="cursor-pointer hover:text-primary dark:hover:text-cream" onClick={() => setView('list')}>Quản lý hóa đơn chưa phát hành</span>
            <span>&gt;</span>
            <span className="text-primary dark:text-cream">Lập hóa đơn nháp</span>
          </div>

          {/* API Connection Card */}
          <div className="glass rounded-3xl border border-primary/10 overflow-hidden shadow-md">
            <button
              onClick={() => setIsApiConfigCollapsed(!isApiConfigCollapsed)}
              className="w-full flex justify-between items-center p-4 bg-[#EBEBE0]/30 dark:bg-dark-surface/30 border-b border-primary/5 text-left text-xs font-extrabold uppercase tracking-wider text-primary dark:text-cream"
              type="button"
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-accent" />
                Cấu hình API kết nối Viettel vInvoice
              </span>
              {isApiConfigCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>

            {!isApiConfigCollapsed && (
              <div className="p-6 space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Endpoint URL</label>
                  <input
                    type="url"
                    value={apiConfig.url}
                    onChange={(e) => setApiConfig({ ...apiConfig, url: e.target.value })}
                    className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-mono font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Basic Auth Username</label>
                    <input
                      type="text"
                      placeholder="Mã số thuế doanh nghiệp..."
                      value={apiConfig.username}
                      onChange={(e) => setApiConfig({ ...apiConfig, username: e.target.value })}
                      className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Basic Auth Password</label>
                    <div className="relative flex items-center">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mật khẩu API..."
                        value={apiConfig.password}
                        onChange={(e) => setApiConfig({ ...apiConfig, password: e.target.value })}
                        className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2 pr-10 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-primary/50 hover:text-accent cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-accent/5 rounded-2xl border border-accent/15">
                  <div className="space-y-0.5 pr-4">
                    <span className="block text-[11px] font-bold text-primary dark:text-cream flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-accent" />
                      Chế độ chạy Giả Lập (Simulation Mode)
                    </span>
                    <span className="block text-[9px] text-primary/60 dark:text-cream/60">
                      Bật để kiểm duyệt logic và giả định phản hồi thành công từ vInvoice mà không gọi API thật.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={apiConfig.useSimulation}
                      onChange={(e) => setApiConfig({ ...apiConfig, useSimulation: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-primary/20 dark:bg-cream/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Upper form block: Side-by-side Customer Info & Invoice Info (Screenshot 2) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs font-semibold">
            
            {/* THÔNG TIN KHÁCH HÀNG (Left Card) */}
            <div className="glass p-6 rounded-3xl border border-primary/10 shadow-lg space-y-4 relative">
              <div className="border-b border-primary/5 pb-2 flex items-center justify-between">
                <h3 className="font-serif text-sm font-extrabold text-primary dark:text-cream border-l-4 border-accent pl-3 uppercase">
                  Thông tin khách hàng
                </h3>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="px-3 py-1 rounded-lg bg-accent/15 border border-accent/25 hover:bg-accent/25 text-[10px] text-primary dark:text-accent font-bold cursor-pointer"
                >
                  Tải mẫu của tôi
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="sellToConsumer"
                  checked={buyerInfo.sellToConsumer}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setBuyerInfo({
                      ...buyerInfo,
                      sellToConsumer: checked,
                      buyerLegalName: checked ? 'Khách hàng không lấy hóa đơn' : '',
                      buyerTaxCode: '',
                      buyerNotGetInvoice: checked ? '1' : '0'
                    });
                  }}
                  className="rounded"
                />
                <label htmlFor="sellToConsumer" className="text-primary/80 dark:text-cream/80 cursor-pointer">Bán cho người tiêu dùng</label>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-primary/75 dark:text-cream/75">Tìm kiếm</label>
                  <input
                    type="text"
                    placeholder="Mã/Tên/MST/SĐT..."
                    className="col-span-2 bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream font-medium"
                  />
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-primary/75 dark:text-cream/75">Tên người mua *</label>
                  <input
                    type="text"
                    required
                    value={buyerInfo.buyerName}
                    onChange={(e) => setBuyerInfo({ ...buyerInfo, buyerName: e.target.value })}
                    className="col-span-2 bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-bold"
                  />
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-primary/75 dark:text-cream/75">Địa chỉ</label>
                  <input
                    type="text"
                    value={buyerInfo.buyerAddressLine}
                    onChange={(e) => setBuyerInfo({ ...buyerInfo, buyerAddressLine: e.target.value })}
                    className="col-span-2 bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream font-medium"
                  />
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-primary/75 dark:text-cream/75">Tên đơn vị *</label>
                  <input
                    type="text"
                    required
                    disabled={buyerInfo.sellToConsumer}
                    value={buyerInfo.buyerLegalName}
                    onChange={(e) => setBuyerInfo({ ...buyerInfo, buyerLegalName: e.target.value })}
                    className="col-span-2 bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream font-semibold disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-primary/75 dark:text-cream/75">Mã số thuế</label>
                  <input
                    type="text"
                    disabled={buyerInfo.sellToConsumer}
                    value={buyerInfo.buyerTaxCode}
                    onChange={(e) => setBuyerInfo({ ...buyerInfo, buyerTaxCode: e.target.value })}
                    placeholder="MST doanh nghiệp..."
                    className="col-span-2 bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream font-mono font-semibold disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-primary/75 dark:text-cream/75">Hợp đồng số</label>
                  <input
                    type="text"
                    value={buyerInfo.contractNo}
                    onChange={(e) => setBuyerInfo({ ...buyerInfo, contractNo: e.target.value })}
                    className="col-span-2 bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream font-medium"
                  />
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-primary/75 dark:text-cream/75">Số điện thoại</label>
                  <input
                    type="text"
                    value={buyerInfo.buyerPhoneNumber}
                    onChange={(e) => setBuyerInfo({ ...buyerInfo, buyerPhoneNumber: e.target.value })}
                    className="col-span-2 bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream font-medium"
                  />
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-primary/75 dark:text-cream/75">Email</label>
                  <input
                    type="email"
                    value={buyerInfo.buyerEmail}
                    onChange={(e) => setBuyerInfo({ ...buyerInfo, buyerEmail: e.target.value })}
                    className="col-span-2 bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream font-medium"
                  />
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-primary/75 dark:text-cream/75">Loại giấy tờ</label>
                  <select
                    value={buyerInfo.buyerIdType}
                    onChange={(e) => setBuyerInfo({ ...buyerInfo, buyerIdType: Number(e.target.value) })}
                    className="col-span-2 bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream cursor-pointer font-bold"
                  >
                    <option value={1}>Chứng minh nhân dân</option>
                    <option value={2}>Căn cước công dân / Hộ chiếu</option>
                    <option value={3}>Mã số thuế doanh nghiệp</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-primary/75 dark:text-cream/75">Số giấy tờ</label>
                  <input
                    type="text"
                    value={buyerInfo.buyerIdNo}
                    onChange={(e) => setBuyerInfo({ ...buyerInfo, buyerIdNo: e.target.value })}
                    className="col-span-2 bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream font-mono"
                  />
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-primary/75 dark:text-cream/75">Tên ngân hàng</label>
                  <input
                    type="text"
                    value={buyerInfo.bankName}
                    onChange={(e) => setBuyerInfo({ ...buyerInfo, bankName: e.target.value })}
                    placeholder="Ví dụ: BIDV"
                    className="col-span-2 bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream font-semibold"
                  />
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-primary/75 dark:text-cream/75">Số tài khoản</label>
                  <input
                    type="text"
                    value={buyerInfo.bankAccountNo}
                    onChange={(e) => setBuyerInfo({ ...buyerInfo, bankAccountNo: e.target.value })}
                    className="col-span-2 bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream font-mono font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* THÔNG TIN HÓA ĐƠN (Right Card) */}
            <div className="glass p-6 rounded-3xl border border-primary/10 shadow-lg space-y-4">
              <div className="border-b border-primary/5 pb-2">
                <h3 className="font-serif text-sm font-extrabold text-primary dark:text-cream border-l-4 border-accent pl-3 uppercase">
                  Thông tin hóa đơn
                </h3>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-primary/75 dark:text-cream/75">Mã / Tên cửa hàng</label>
                  <div className="col-span-2 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Mã..."
                      value={invoiceInfo.shopCode}
                      onChange={(e) => setInvoiceInfo({ ...invoiceInfo, shopCode: e.target.value })}
                      className="bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Tên cửa hàng..."
                      value={invoiceInfo.shopName}
                      onChange={(e) => setInvoiceInfo({ ...invoiceInfo, shopName: e.target.value })}
                      className="bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-primary/75 dark:text-cream/75">Mã ĐĐ kinh doanh</label>
                  <div className="col-span-2 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Mã địa điểm..."
                      value={invoiceInfo.businessLocationCode}
                      onChange={(e) => setInvoiceInfo({ ...invoiceInfo, businessLocationCode: e.target.value })}
                      className="bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Tên địa điểm..."
                      value={invoiceInfo.businessLocationName}
                      onChange={(e) => setInvoiceInfo({ ...invoiceInfo, businessLocationName: e.target.value })}
                      className="bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-primary/75 dark:text-cream/75">Địa chỉ ĐĐKD</label>
                  <input
                    type="text"
                    value={invoiceInfo.businessLocationAddress}
                    onChange={(e) => setInvoiceInfo({ ...invoiceInfo, businessLocationAddress: e.target.value })}
                    className="col-span-2 bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream font-medium"
                  />
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-primary/75 dark:text-cream/75">Hình thức TT *</label>
                  <select
                    value={invoiceInfo.paymentMethod}
                    onChange={(e) => setInvoiceInfo({ ...invoiceInfo, paymentMethod: e.target.value })}
                    className="col-span-2 bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream cursor-pointer font-bold"
                  >
                    <option value="2">TM/CK</option>
                    <option value="1">Tiền mặt</option>
                    <option value="3">Chuyển khoản</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-primary/75 dark:text-cream/75">Loại tiền / Tỷ giá *</label>
                  <div className="col-span-2 grid grid-cols-2 gap-2">
                    <select
                      value={invoiceInfo.currencyCode}
                      onChange={(e) => setInvoiceInfo({ ...invoiceInfo, currencyCode: e.target.value })}
                      className="bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream cursor-pointer font-bold"
                    >
                      <option value="VND">VND</option>
                      <option value="USD">USD</option>
                    </select>
                    <input
                      type="number"
                      required
                      min="1"
                      value={invoiceInfo.exchangeRate}
                      onChange={(e) => setInvoiceInfo({ ...invoiceInfo, exchangeRate: Number(e.target.value) })}
                      className="bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-primary/75 dark:text-cream/75">Mẫu hóa đơn *</label>
                  <input
                    type="text"
                    required
                    value={invoiceInfo.templateCode}
                    onChange={(e) => setInvoiceInfo({ ...invoiceInfo, templateCode: e.target.value })}
                    className="col-span-2 bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream font-mono font-bold"
                  />
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-primary/75 dark:text-cream/75">Ký hiệu hóa đơn *</label>
                  <input
                    type="text"
                    required
                    value={invoiceInfo.invoiceSeries}
                    onChange={(e) => setInvoiceInfo({ ...invoiceInfo, invoiceSeries: e.target.value })}
                    className="col-span-2 bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream font-mono font-bold"
                  />
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-primary/75 dark:text-cream/75">Số bảng kê / Ngày</label>
                  <div className="col-span-2 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Số..."
                      value={invoiceInfo.ledgerNo}
                      onChange={(e) => setInvoiceInfo({ ...invoiceInfo, ledgerNo: e.target.value })}
                      className="bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream font-mono"
                    />
                    <input
                      type="date"
                      value={invoiceInfo.ledgerDate}
                      onChange={(e) => setInvoiceInfo({ ...invoiceInfo, ledgerDate: e.target.value })}
                      className="bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-primary/75 dark:text-cream/75">Số lượng nhân bản</label>
                  <input
                    type="number"
                    min="1"
                    value={invoiceInfo.numberOfCopies}
                    onChange={(e) => setInvoiceInfo({ ...invoiceInfo, numberOfCopies: Number(e.target.value) })}
                    className="col-span-2 bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream font-mono font-bold"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Lower form block: CHI TIẾT HÓA ĐƠN grid (Screenshot 3) */}
          <div className="glass p-6 rounded-3xl border border-primary/10 shadow-lg space-y-6">
            <div className="border-b border-primary/5 pb-2">
              <h3 className="font-serif text-sm font-extrabold text-primary dark:text-cream border-l-4 border-accent pl-3 uppercase">
                Chi tiết hóa đơn
              </h3>
            </div>

            {/* Items Grid Table matches Screenshot 3 */}
            <div className="overflow-x-auto rounded-2xl border border-primary/10">
              <table className="w-full text-left text-xs font-semibold text-primary dark:text-cream border-collapse">
                <thead className="bg-[#EBEBE0]/60 dark:bg-dark-surface/60 text-primary/60 dark:text-cream/60 uppercase border-b border-primary/10 text-center">
                  <tr>
                    <th className="p-3 w-16">STT</th>
                    <th className="p-3 w-40">Tính chất *</th>
                    <th className="p-3">Hàng hóa</th>
                    <th className="p-3 w-28">Đơn vị tính</th>
                    <th className="p-3 w-24">Số lượng *</th>
                    <th className="p-3 w-36">Đơn giá *</th>
                    <th className="p-3 w-44">Thành tiền *</th>
                    <th className="p-3 w-16">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5 dark:divide-cream/5">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-primary/5 dark:hover:bg-cream/5 transition-colors">
                      <td className="p-3 text-center font-mono font-bold text-primary/50 dark:text-cream/50">
                        {idx + 1}
                      </td>

                      <td className="p-3">
                        <select
                          value={item.selection}
                          onChange={(e) => handleItemChange(item.id, 'selection', Number(e.target.value))}
                          className="w-full bg-cream/50 dark:bg-dark-surface/50 border border-primary/10 rounded-xl px-2 py-1.5 text-xs text-primary dark:text-cream font-extrabold"
                        >
                          <option value={1}>Hàng hóa</option>
                          <option value={3}>Chiết khấu</option>
                          <option value={2}>Ghi chú</option>
                        </select>
                      </td>

                      <td className="p-3">
                        <input
                          type="text"
                          required
                          value={item.itemName}
                          onChange={(e) => handleItemChange(item.id, 'itemName', e.target.value)}
                          placeholder="Tên hàng hóa / dịch vụ..."
                          className="w-full bg-cream/50 dark:bg-dark-surface/50 border border-primary/10 rounded-xl px-3 py-1.5 text-xs text-primary dark:text-cream font-semibold"
                        />
                      </td>

                      <td className="p-3">
                        <input
                          type="text"
                          disabled={Number(item.selection) !== 1}
                          value={item.unitName || ''}
                          onChange={(e) => handleItemChange(item.id, 'unitName', e.target.value)}
                          className="w-full bg-cream/50 dark:bg-dark-surface/50 border border-primary/10 rounded-xl px-2 py-1.5 text-xs text-center text-primary dark:text-cream font-medium disabled:opacity-40"
                        />
                      </td>

                      <td className="p-3">
                        <input
                          type="number"
                          min="1"
                          disabled={Number(item.selection) !== 1}
                          value={item.quantity === null ? '' : item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-cream/50 dark:bg-dark-surface/50 border border-primary/10 rounded-xl px-2 py-1.5 text-xs text-center text-primary dark:text-cream font-mono font-bold disabled:opacity-40"
                        />
                      </td>

                      <td className="p-3">
                        <input
                          type="number"
                          min="0"
                          disabled={Number(item.selection) !== 1}
                          value={item.unitPrice === null ? '' : item.unitPrice}
                          onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-cream/50 dark:bg-dark-surface/50 border border-primary/10 rounded-xl px-2 py-1.5 text-xs text-right text-primary dark:text-cream font-mono font-bold disabled:opacity-40"
                        />
                      </td>

                      <td className="p-3">
                        {Number(item.selection) === 1 ? (
                          <input
                            type="text"
                            readOnly
                            value={((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0) - (Number(item.discount) || 0)).toLocaleString() + ' VND'}
                            className="w-full bg-transparent border-0 px-2 py-1.5 text-xs text-right text-accent font-mono font-bold focus:outline-none"
                          />
                        ) : Number(item.selection) === 3 ? (
                          <div className="relative flex items-center">
                            <input
                              type="number"
                              min="0"
                              value={item.itemTotalAmountWithoutTax || ''}
                              onChange={(e) => handleItemChange(item.id, 'itemTotalAmountWithoutTax', Number(e.target.value))}
                              className="w-full bg-cream/50 dark:bg-dark-surface/50 border border-primary/10 rounded-xl px-2 py-1.5 pr-8 text-xs text-right text-red-500 font-mono font-bold"
                            />
                            <span className="absolute right-2 text-[10px] text-red-500 font-bold">-</span>
                          </div>
                        ) : (
                          <span className="block text-center text-primary/30 dark:text-cream/30 italic">—</span>
                        )}
                      </td>

                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 rounded bg-red-500/10 hover:bg-red-500/25 text-red-500 transition-colors cursor-pointer border border-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add row controls */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleAddItem}
                className="px-4 py-2.5 rounded-xl bg-accent text-primary hover:bg-accent/90 shadow-sm font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-transparent"
              >
                <Plus className="w-4 h-4" /> Thêm hàng hóa
              </button>
            </div>

            {/* Sub-billing summary panel (Screenshot 3) */}
            <div className="flex justify-end pt-4 border-t border-primary/5 text-xs font-bold text-primary/80 dark:text-cream/80">
              <div className="w-full max-w-md space-y-2.5">
                <div className="flex justify-between border-b border-primary/5 pb-1">
                  <span className="text-primary/50 dark:text-cream/50">Tổng tiền hàng</span>
                  <span className="font-mono">{totals.sumOfTotalLineAmountWithoutTax.toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between border-b border-primary/5 pb-1">
                  <span className="text-primary/50 dark:text-cream/50">Tổng tiền trước thuế</span>
                  <span className="font-mono">{(totals.totalAmountWithoutTax).toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between border-b border-primary/5 pb-1">
                  <span className="text-primary/50 dark:text-cream/50">Tổng tiền thuế</span>
                  <span className="font-mono text-accent">+{totals.totalTaxAmount.toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between border-b border-primary/5 pb-1">
                  <span className="text-primary/50 dark:text-cream/50">Tổng tiền sau thuế</span>
                  <span className="font-mono font-extrabold text-accent">{(totals.totalAmountWithTax).toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between p-3 rounded-2xl bg-accent/15 border border-accent/20">
                  <span className="text-accent uppercase font-extrabold">Tổng tiền thanh toán</span>
                  <span className="font-mono font-serif font-extrabold text-sm">{totals.totalAmountWithTax.toLocaleString()} VND</span>
                </div>
                <div className="pt-2 text-[10px] text-primary/70 dark:text-cream/70 italic leading-relaxed text-right">
                  <span className="font-bold text-primary dark:text-cream">Số tiền bằng chữ: </span> {totals.totalAmountWithTaxInWords}
                </div>
              </div>
            </div>

            {/* General invoice metadata note */}
            <div className="pt-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Ghi chú chung hóa đơn (invoiceNote)</label>
              <textarea
                value={invoiceNote}
                onChange={(e) => setInvoiceNote(e.target.value)}
                placeholder="Nhập ghi chú chung hiển thị dưới đáy hóa đơn..."
                rows={2}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-medium"
              />
            </div>

          </div>

          {/* Sticky Bottom Actions Bar (Screenshot 2 & 3 buttons) */}
          <div className="flex flex-wrap items-center justify-center gap-4 bg-[#EBEBE0]/30 dark:bg-dark-surface/30 p-4 rounded-3xl border border-primary/10">
            <button
              type="button"
              onClick={() => setView('list')}
              className="px-6 py-3 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary dark:text-cream border border-primary/10 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <X className="w-4 h-4" /> Quay lại
            </button>
            
            <button
              type="button"
              onClick={handleClearForm}
              className="px-6 py-3 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 border border-transparent"
            >
              <RefreshCw className="w-4 h-4" /> Xóa dữ liệu nhập
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveConsoleTab('payload');
                setShowPreviewModal(true);
              }}
              className="px-6 py-3 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 border border-transparent"
            >
              <Eye className="w-4 h-4" /> Xem trước
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleCreateDraft}
              className="px-6 py-3 rounded-xl bg-accent text-primary hover:bg-accent/95 shadow-md font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 border border-transparent"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{apiConfig.useSimulation ? 'CHẠY MÔ PHỎNG NHÁP' : 'LẬP HÓA ĐƠN NHÁP'}</span>
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL COMPONENT FOR JSON PREVIEW & LOGS DEBUGGER */}
      {/* ========================================================================= */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setShowPreviewModal(false)}>
          <div className="w-full max-w-3xl bg-cream dark:bg-dark-surface rounded-3xl border border-primary/20 shadow-2xl overflow-hidden flex flex-col h-[650px] animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="bg-[#EBEBE0]/80 dark:bg-dark-bg/60 p-4 border-b border-primary/10 flex justify-between items-center">
              <h4 className="font-serif text-sm font-extrabold text-primary dark:text-cream flex items-center gap-2">
                <Receipt className="w-5 h-5 text-accent" />
                Công cụ kiểm duyệt vInvoice
              </h4>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-lg hover:bg-primary/5 text-primary/60 dark:text-cream/60 cursor-pointer"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Switchers */}
            <div className="flex border-b border-primary/10 dark:border-cream/10 px-4 bg-[#EBEBE0]/30 dark:bg-dark-bg/30">
              <button
                onClick={() => setActiveConsoleTab('payload')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeConsoleTab === 'payload'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-primary/50 dark:text-cream/50 hover:text-primary dark:hover:text-cream'
                }`}
              >
                <FileCode className="w-4 h-4" /> JSON Gửi Đi (Payload)
              </button>

              <button
                onClick={() => setActiveConsoleTab('console')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeConsoleTab === 'console'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-primary/50 dark:text-cream/50 hover:text-primary dark:hover:text-cream'
                }`}
              >
                <Terminal className="w-4 h-4" /> Logs Truyền Tin
              </button>
            </div>

            {/* Modal Contents */}
            <div className="flex-grow flex flex-col min-h-0 bg-slate-950 p-4 font-mono text-[10.5px]">
              {activeConsoleTab === 'payload' ? (
                <div className="flex flex-col h-full space-y-2">
                  <div className="flex justify-between items-center text-[9px] font-bold text-emerald-400/70">
                    <span>vinvoice_draft_payload.json</span>
                    <button
                      onClick={() => handleCopyJson(payloadJson)}
                      className="flex items-center gap-1 hover:text-accent transition-colors text-[9px] cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copiedJson ? 'Đã sao chép!' : 'Sao chép JSON'}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={payloadJson}
                    className="flex-grow w-full bg-transparent text-emerald-400 resize-none focus:outline-none leading-relaxed"
                  />
                </div>
              ) : (
                <div className="flex flex-col h-full space-y-2">
                  <div className="flex justify-between items-center text-[9px] font-bold text-cyan-400/70">
                    <span>API logs terminal status</span>
                    <button
                      onClick={() => setConsoleLogs('// Đã dọn sạch logs.')}
                      className="hover:underline transition-colors text-[9px] cursor-pointer"
                    >
                      Xóa logs
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={consoleLogs}
                    className="flex-grow w-full bg-transparent text-cyan-400 resize-none focus:outline-none leading-relaxed"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer help instructions */}
            <div className="p-4 bg-primary/5 border-t border-primary/10 flex items-center gap-2 text-[10px] text-primary/70 dark:text-cream/70 font-semibold">
              <AlertCircle className="w-4.5 h-4.5 text-accent flex-shrink-0" />
              <span>Chạy giả lập để xem trước cấu trúc gói tin và phản hồi mẫu của vInvoice trước khi tắt Simulation để truyền tin thật.</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
