<<<<<<< HEAD
import React from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url?: string;
  category_id: number;
  category?: { name: string };
}

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  product?: Product;
}

interface Order {
  id: number;
  customer_id?: number | null;
  guest_name?: string;
  guest_phone?: string;
  total_amount: number;
  discount_amount: number;
  discount_type?: string;
  tax_amount: number;
  payment_method: string;
  created_at: string;
  items?: OrderItem[];
  customer?: { name: string; address?: string };
  user?: { name: string };
}

interface ReceiptProps {
  order: Order;
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
  cashierName?: string;
  deliveryAddress?: string;
}

const Receipt: React.FC<ReceiptProps> = ({
  order,
  storeName = "SMSystem Store",
  storeAddress = "123 Main Street, City, State 12345",
  storePhone = "(555) 123-4567",
  cashierName,
  deliveryAddress
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const subtotal = order.items?.reduce((sum, item) => sum + item.subtotal, 0) || 0;
  const discountAmount = order.discount_amount || 0;
  const taxAmount = order.tax_amount || 0;

  // Get delivery address
  const address = deliveryAddress || order.customer?.address || 'N/A';

  return (
    <div className="receipt-container font-sans text-xs w-[8.5in] h-[11in] mx-auto bg-white p-8 border border-gray-300 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-4xl font-black text-red-600 mb-1">SMS TYRE DEPOT</div>
        <p className="text-sm font-semibold text-gray-900 mb-1">{storeAddress}</p>
        <p className="text-sm text-gray-700 mb-4">Phone: {storePhone}</p>
        <div className="border-b-2 border-gray-400 pb-2 mb-4"></div>
      </div>

      {/* Receipt Title and Date */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-bold text-gray-900">OFFICIAL RECEIPT/INVOICE</div>
        <div className="text-right">
          <p className="text-sm"><span className="font-semibold">Receipt #:</span> {order.id.toString().padStart(6, '0')}</p>
          <p className="text-sm"><span className="font-semibold">Date:</span> {formatDate(order.created_at)}</p>
        </div>
      </div>

      {/* Sold To Section */}
      <div className="mb-6">
        <p className="font-bold text-gray-900 mb-2 text-sm">SOLD TO:</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-600">Registered Name:</p>
            <p className="font-semibold">{order.customer?.name || order.guest_name || 'Walk-in Customer'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">TIN:</p>
            <p className="font-semibold">N/A</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-600">Business Address:</p>
            <p className="font-semibold">{address}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-6 border-collapse">
        <thead>
          <tr className="border-t-2 border-b-2 border-gray-900">
            <th className="text-left py-2 px-1 font-bold text-sm">ITEM DESCRIPTION</th>
            <th className="text-center py-2 px-1 font-bold text-sm w-16">QUANTITY</th>
            <th className="text-right py-2 px-1 font-bold text-sm w-24">UNIT PRICE</th>
            <th className="text-right py-2 px-1 font-bold text-sm w-24">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item, index) => (
            <tr key={index} className="border-b border-gray-300">
              <td className="py-2 px-1 text-sm">{item.product?.name || `Product ${item.product_id}`}</td>
              <td className="text-center py-2 px-1 text-sm">{item.quantity}</td>
              <td className="text-right py-2 px-1 text-sm">{formatCurrency(item.price)}</td>
              <td className="text-right py-2 px-1 text-sm">{formatCurrency(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals Section */}
      <div className="flex justify-end mb-6 w-full">
        <div className="w-64">
          <div className="flex justify-between py-2 text-sm">
            <span className="font-semibold">Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between py-2 text-sm">
              <span className="font-semibold">Discount:</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}

          {taxAmount > 0 && (
            <div className="flex justify-between py-2 text-sm">
              <span className="font-semibold">Tax:</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
          )}

          <div className="flex justify-between py-3 text-lg font-bold border-t-2 border-gray-900">
            <span>TOTAL AMOUNT DUE:</span>
            <span>{formatCurrency(order.total_amount)}</span>
          </div>

          <div className="flex justify-between py-2 text-sm">
            <span className="font-semibold">Payment Method:</span>
            <span className="capitalize">{order.payment_method}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-600 border-t border-gray-400 pt-4 mt-auto">
        <p className="font-semibold mb-1">Thank you for your business!</p>
        <p>SMS Tyre Depot - Your trusted tyre partner</p>
      </div>
    </div>
  );
};

// Print function for official receipt
export const printReceipt = (order: Order, cashierName?: string, deliveryAddress?: string) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank', 'width=1000,height=1300');

  if (!printWindow) {
    alert('Please allow popups for this website to print receipts');
    return;
  }

  // Generate receipt HTML
  const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receipt #${order.id}</title>
      <style>
        @media print {
          body { margin: 0; padding: 0; }
          .receipt-container { width: 8.5in; height: 11in; page-break-after: avoid; }
          button { display: none; }
        }
        body {
          font-family: Arial, sans-serif;
          font-size: 12px;
          line-height: 1.4;
          margin: 0;
          padding: 0;
        }
        .receipt-container {
          width: 8.5in;
          height: 11in;
          background: white;
          padding: 0.5in;
          box-sizing: border-box;
          position: relative;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .font-bold { font-weight: bold; }
        .font-semibold { font-weight: 600; }
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .items-center { align-items: center; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 8px 4px; text-align: left; }
        th { font-weight: bold; border-top: 2px solid #000; border-bottom: 2px solid #000; }
        td { border-bottom: 1px solid #ccc; }
        .grid { display: grid; }
        .grid-cols-2 { grid-template-columns: 1fr 1fr; gap: 20px; }
        .col-span-2 { grid-column: span 2; }
        .mb-4 { margin-bottom: 20px; }
        .mb-6 { margin-bottom: 30px; }
        .pb-2 { padding-bottom: 10px; }
        .pt-4 { padding-top: 20px; }
        .mt-auto { margin-top: auto; }
        .border-t { border-top: 1px solid #ccc; }
        .border-b-2 { border-bottom: 2px solid #9CA3AF; }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        ${generateReceiptContent(order, deliveryAddress)}
      </div>
=======
/**
 * Sales Invoice Receipt — prints TEXT ONLY onto pre-printed LETTER (8.5" x 11") invoice paper.
 * All positions use absolute positioning (in inches) to align with form fields.
 * No borders or boxes are printed — those are already on the paper.
 *
 * PREVIEW MODE: Shows scanned form as background so you can visually align text.
 * The background is hidden when printing (@media print).
 */

interface ReceiptOrderItem {
  id: number;
  quantity: number;
  price: number;
  subtotal: number;
  product?: { name: string };
}

interface ReceiptOrder {
  id: number;
  total_amount: number;
  discount_amount: number;
  payment_method: string;
  created_at: string;
  guest_name?: string;
  guest_phone?: string;
  customer?: { name: string; phone?: string; address?: string };
  items?: ReceiptOrderItem[];
}

export function printReceipt(order: ReceiptOrder, tin?: string, businessAddress?: string, withholdingTaxRate?: number) {
  const date = new Date(order.created_at);
  const dateStr = date.toLocaleDateString('en-PH', { year: 'numeric', month: '2-digit', day: '2-digit' });

  // Customer info
  const customerName = order.customer?.name || order.guest_name || 'WALK-IN';
  const custAddress = businessAddress || order.customer?.address || '';
  const custTin = tin || '';

  // VAT calculations (Philippine 12% VAT)
  const totalAmount = order.total_amount || 0;
  const discountAmount = order.discount_amount || 0;
  const vatInclusive = totalAmount;
  const vatAmount = vatInclusive / 1.12 * 0.12;
  const netOfVat = vatInclusive - vatAmount;
  const vatableSales = netOfVat;
  const whTaxRate = withholdingTaxRate || 0;
  const whTaxAmount = netOfVat * (whTaxRate / 100);
  const totalAmountDue = totalAmount - whTaxAmount;

  const fmt = (n: number | undefined | null) => (n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Build item rows
  const items = order.items || [];
  const itemRows = items.map(item => {
    const unitPrice = item.price ?? (item.subtotal && item.quantity ? item.subtotal / item.quantity : 0);
    const subtotal = item.subtotal ?? 0;
    return `
    <tr>
      <td style="padding:1px 4px; font-size:15px">${item.product?.name || ''}</td>
      <td style="padding:1px 4px; font-size:15px; text-align:center">${item.quantity}</td>
      <td style="padding:1px 4px; font-size:15px; text-align:right">${fmt(unitPrice)}</td>
      <td style="padding:1px 4px; font-size:15px; text-align:right">${fmt(subtotal)}</td>
    </tr>
  `;
  }).join('');

  const emptyRowsNeeded = Math.max(0, 14 - items.length);
  const emptyRows = Array(emptyRowsNeeded).fill('<tr><td style="padding:1px 4px">&nbsp;</td><td></td><td></td><td></td></tr>').join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice Preview — Align &amp; Print</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page {
          size: 8.27in 11.69in;
          margin: 0;
        }
        body {
          font-family: 'Courier New', Courier, monospace;
          font-size: 15px;
          color: #000;
          width: 8.27in;
          height: 11.69in;
          position: relative;
          /* ★ PRINTER OFFSET — adjust this single value to shift ALL text up/down ★
             Negative = move UP, Positive = move DOWN
             Change this when switching printers */
          --printer-offset: 0in;
        }

        /* ═══════════════════════════════════════════════
           BACKGROUND TEMPLATE — visible on screen only
           Hidden when printing on actual pre-printed paper
           ═══════════════════════════════════════════════ */
        .bg-template {
          position: absolute;
          top: 0;
          left: 0;
          width: 8.27in;
          height: 11.69in;
          opacity: 0.3;
          z-index: 0;
          pointer-events: none;
        }
        .bg-template img {
          width: 100%;
          height: 100%;
          object-fit: fill;
        }

        /* Hide background + toolbar when actually printing */
        @media print {
          /* TEMP: Allow background image on print for alignment verification */
           .bg-template { 
             display: block !important; 
             opacity: 0.25 !important; 
             -webkit-print-color-adjust: exact !important; 
             print-color-adjust: exact !important; 
           }
           .bg-template img { 
             display: block !important; 
             opacity: 0.25 !important; 
           }
          .toolbar { display: none !important; }
        }

        /* All text fields sit above the background */
        .date-field, .reg-name, .tin-field, .address,
        .items-table, .vatable-sales, .vat-amount-left,
        .zero-rated, .vat-exempt, .total-vat-incl,
        .less-vat, .net-of-vat, .less-discount,
        .add-vat, .less-withholding, .total-due {
          z-index: 1;
        }

        /* ══════════════════════════════════════════════
           POSITION GUIDE — calibrated from scanned form
           Paper: Letter 8.5" × 11"
           All values are in inches from top-left corner.
           ══════════════════════════════════════════════ */

        /* ---------- Customer Info Section ---------- */
        .date-field { position: absolute; top: calc(1.70in + var(--printer-offset));  left: 6.80in;  font-size: 15px; }
        .reg-name   { position: absolute; top: calc(2.01in + var(--printer-offset));  left: 2.10in;  font-size: 15px; }
        .tin-field   { position: absolute; top: calc(2.43in + var(--printer-offset));  left: 2.15in;  font-size: 15px; }
        .address    { position: absolute; top: calc(2.77in + var(--printer-offset));  left: 1.70in;  font-size: 15px; }

        /* ---------- Items Table ---------- */
        .items-table {
          position: absolute;
          top: calc(3.47in + var(--printer-offset));
          left: 1.52in;
          width: 6.40in;
        }
        .items-table table {
          width: 100%;
          border-collapse: collapse;
        }
        .items-table td {
          height: 0.29in;
          vertical-align: middle;
        }
        .items-table .col-desc  { width: 50%; padding-left: 0.1in; }
        .items-table .col-qty   { width: 10%; text-align: center; }
        .items-table .col-price { width: 20%; text-align: right; }
        .items-table .col-amt   { width: 20%; text-align: right; }

        /* ---------- Tax Summary (Bottom Left) ---------- */
        .vatable-sales   { position: absolute; top: calc(7.36in + var(--printer-offset)); left: 2.77in; font-size: 15px; text-align: right; width: 1.2in; }
        .vat-amount-left { position: absolute; top: calc(7.84in + var(--printer-offset)); left: 2.77in; font-size: 15px; text-align: right; width: 1.2in; }
        .zero-rated      { position: absolute; top: calc(8.33in + var(--printer-offset)); left: 2.77in; font-size: 15px; text-align: right; width: 1.2in; }
        .vat-exempt      { position: absolute; top: calc(8.61in + var(--printer-offset)); left: 2.77in; font-size: 15px; text-align: right; width: 1.2in; }

        /* ---------- Tax Summary (Bottom Right) ---------- */
        .total-vat-incl  { position: absolute; top: calc(7.36in + var(--printer-offset)); left: 6.20in; font-size: 15px; text-align: right; width: 1.5in; }
        .less-vat        { position: absolute; top: calc(7.84in + var(--printer-offset)); left: 6.20in; font-size: 15px; text-align: right; width: 1.5in; }
        .net-of-vat      { position: absolute; top: calc(8.12in + var(--printer-offset)); left: 6.20in; font-size: 15px; text-align: right; width: 1.5in; }
        .less-discount   { position: absolute; top: calc(8.61in + var(--printer-offset)); left: 6.20in; font-size: 15px; text-align: right; width: 1.5in; }
        .add-vat         { position: absolute; top: calc(8.95in + var(--printer-offset)); left: 6.20in; font-size: 15px; text-align: right; width: 1.5in; }
        .less-withholding { position: absolute; top: calc(9.23in + var(--printer-offset)); left: 6.20in; font-size: 15px; text-align: right; width: 1.5in; }
        .total-due       { position: absolute; top: calc(9.58in + var(--printer-offset)); left: 6.20in; font-size: 15px; font-weight: bold; text-align: right; width: 1.5in; }

        /* ---------- Toolbar ---------- */
        .toolbar {
          position: fixed;
          top: 10px;
          right: 10px;
          z-index: 9999;
          display: flex;
          gap: 8px;
          background: #333;
          padding: 8px 12px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .toolbar button {
          padding: 6px 14px;
          font-size: 13px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        .btn-print {
          background: #4CAF50;
          color: white;
        }
        .btn-toggle {
          background: #2196F3;
          color: white;
        }
        .btn-close {
          background: #f44336;
          color: white;
        }
      </style>
    </head>
    <body>

      <!-- Toolbar for preview controls (hidden when printing) -->
      <div class="toolbar">
        <button class="btn-toggle" onclick="toggleBg()">Toggle Background</button>
        <button class="btn-print" onclick="window.print()">🖨️ Print</button>
        <button class="btn-close" onclick="window.close()">✕ Close</button>
      </div>

      <!-- Scanned form background (visible on screen only) -->
      <div class="bg-template" id="bgTemplate">
        <img src="/PLDT NEW SI FORMAT.xlsx.png" alt="Invoice template" />
      </div>

      <!-- Customer Info -->
      <div class="date-field">${dateStr}</div>
      <div class="reg-name">${customerName}</div>
      <div class="tin-field">${custTin}</div>
      <div class="address">${custAddress}</div>

      <!-- Items Table -->
      <div class="items-table">
        <table>
          <colgroup>
            <col class="col-desc" />
            <col class="col-qty" />
            <col class="col-price" />
            <col class="col-amt" />
          </colgroup>
          ${itemRows}
          ${emptyRows}
        </table>
      </div>

      <!-- Tax Summary — Left Side -->
      <div class="vatable-sales">${fmt(vatableSales)}</div>
      <div class="vat-amount-left">${fmt(vatAmount)}</div>
      <div class="zero-rated">0.00</div>
      <div class="vat-exempt">0.00</div>

      <!-- Tax Summary — Right Side -->
      <div class="total-vat-incl">${fmt(vatInclusive)}</div>
      <div class="less-vat">${fmt(vatAmount)}</div>
      <div class="net-of-vat">${fmt(netOfVat)}</div>
      <div class="less-discount">${discountAmount > 0 ? fmt(discountAmount) : '0.00'}</div>
      <div class="add-vat">${fmt(vatAmount)}</div>
      <div class="less-withholding">${fmt(whTaxAmount)}</div>
      <div class="total-due">${fmt(totalAmountDue)}</div>

      <script>
        function toggleBg() {
          const bg = document.getElementById('bgTemplate');
          if (bg.style.display === 'none') {
            bg.style.display = 'block';
          } else {
            bg.style.display = 'none';
          }
        }
      </script>
>>>>>>> b39ac8e7d159570752c42991a6e309da0a0ccfe3
    </body>
    </html>
  `;

<<<<<<< HEAD
  printWindow.document.write(receiptHTML);
  printWindow.document.close();

  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.print();
  };
};

// Helper function to generate receipt content
const generateReceiptContent = (order: Order, deliveryAddress?: string): string => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const subtotal = order.items?.reduce((sum, item) => sum + item.subtotal, 0) || 0;
  const discountAmount = order.discount_amount || 0;
  const taxAmount = order.tax_amount || 0;
  const address = deliveryAddress || order.customer?.address || 'N/A';

  let content = `
    <!-- Sold To Section (just values) -->
    <div style="margin-bottom: 20px; font-size: 12px;">
      <p style="margin: 0; line-height: 1.4;">${order.customer?.name || order.guest_name || 'Walk-in Customer'}</p>
      <p style="margin: 0; line-height: 1.4;">N/A</p>
      <p style="margin: 0; line-height: 1.4;">${address}</p>
    </div>

    <!-- Items Table -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tbody>`;

  order.items?.forEach((item) => {
    content += `
        <tr style="border-bottom: 1px solid #ccc;">
          <td style="padding: 5px 4px; font-size: 11px; text-align: left;">${item.product?.name || `Product ${item.product_id}`}</td>
          <td style="padding: 5px 4px; font-size: 11px; text-align: center; width: 60px;">${item.quantity}</td>
          <td style="padding: 5px 4px; font-size: 11px; text-align: right; width: 80px;">${formatCurrency(item.price)}</td>
          <td style="padding: 5px 4px; font-size: 11px; text-align: right; width: 80px;">${formatCurrency(item.subtotal)}</td>
        </tr>`;
  });

  content += `
      </tbody>
    </table>

    <!-- Totals Section -->
    <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
      <div style="width: 250px; font-size: 11px;">
        <div style="display: flex; justify-content: space-between; padding: 5px 0;">
          <span>${formatCurrency(subtotal)}</span>
        </div>`;

  if (discountAmount > 0) {
    content += `
        <div style="display: flex; justify-content: space-between; padding: 5px 0;">
          <span>-${formatCurrency(discountAmount)}</span>
        </div>`;
  }

  if (taxAmount > 0) {
    content += `
        <div style="display: flex; justify-content: space-between; padding: 5px 0;">
          <span>${formatCurrency(taxAmount)}</span>
        </div>`;
  }

  content += `
        <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 12px; font-weight: bold; border-top: 1px solid #000; border-bottom: 1px solid #000;">
          <span>${formatCurrency(order.total_amount)}</span>
        </div>

        <div style="display: flex; justify-content: space-between; padding: 5px 0; font-size: 10px;">
          <span style="text-transform: capitalize;">${order.payment_method}</span>
        </div>
      </div>
    </div>`;

  return content;
};

export default Receipt;

=======
  const printWindow = window.open('', '_blank', 'width=850,height=1100');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
>>>>>>> b39ac8e7d159570752c42991a6e309da0a0ccfe3
