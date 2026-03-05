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
          size: 8.5in 11in;
          margin: 0;
        }
        body {
          font-family: 'Courier New', Courier, monospace;
          font-size: 15px;
          color: #000;
          width: 8.5in;
          height: 11in;
          position: relative;
          /* ★ PRINTER OFFSET — adjust this single value to shift ALL text up/down ★
             Negative = move UP, Positive = move DOWN
             Change this when switching printers */
          --printer-offset: -0.50in;
        }

        /* ═══════════════════════════════════════════════
           BACKGROUND TEMPLATE — visible on screen only
           Hidden when printing on actual pre-printed paper
           ═══════════════════════════════════════════════ */
        .bg-template {
          position: absolute;
          top: 0;
          left: 0;
          width: 8.5in;
          height: 11in;
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
          .bg-template { display: none !important; }
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
        .date-field { position: absolute; top: calc(1.65in + var(--printer-offset));  left: 5.85in;  font-size: 15px; }
        .reg-name   { position: absolute; top: calc(2.26in + var(--printer-offset));  left: 2.00in;  font-size: 15px; }
        .tin-field   { position: absolute; top: calc(2.60in + var(--printer-offset));  left: 1.00in;  font-size: 15px; }
        .address    { position: absolute; top: calc(2.92in + var(--printer-offset));  left: 2.00in;  font-size: 15px; }

        /* ---------- Items Table ---------- */
        .items-table {
          position: absolute;
          top: calc(3.70in + var(--printer-offset));
          left: 0.43in;
          width: 7.55in;
        }
        .items-table table {
          width: 100%;
          border-collapse: collapse;
        }
        .items-table td {
          height: 0.29in;
          vertical-align: middle;
        }
        .items-table .col-desc  { width: 55%; }
        .items-table td:first-child { padding-left: 0.40in !important; }
        .items-table .col-qty   { width: 11%; text-align: center; }
        .items-table .col-price { width: 16%; text-align: right; }
        .items-table .col-amt   { width: 18%; text-align: right; }

        /* ---------- Tax Summary (Bottom Left) ---------- */
        .vatable-sales   { position: absolute; top: calc(7.55in + var(--printer-offset)); left: 2.50in; font-size: 15px; text-align: right; width: 1.3in; }
        .vat-amount-left { position: absolute; top: calc(7.82in + var(--printer-offset)); left: 2.50in; font-size: 15px; text-align: right; width: 1.3in; }
        .zero-rated      { position: absolute; top: calc(8.09in + var(--printer-offset)); left: 2.50in; font-size: 15px; text-align: right; width: 1.3in; }
        .vat-exempt      { position: absolute; top: calc(8.36in + var(--printer-offset)); left: 2.50in; font-size: 15px; text-align: right; width: 1.3in; }

        /* ---------- Tax Summary (Bottom Right) ---------- */
        .total-vat-incl  { position: absolute; top: calc(7.55in + var(--printer-offset)); left: 6.10in; font-size: 15px; text-align: right; width: 1.8in; }
        .less-vat        { position: absolute; top: calc(7.82in + var(--printer-offset)); left: 6.10in; font-size: 15px; text-align: right; width: 1.8in; }
        .net-of-vat      { position: absolute; top: calc(8.09in + var(--printer-offset)); left: 6.10in; font-size: 15px; text-align: right; width: 1.8in; }
        .less-discount   { position: absolute; top: calc(8.46in + var(--printer-offset)); left: 6.10in; font-size: 15px; text-align: right; width: 1.8in; }
        .add-vat         { position: absolute; top: calc(8.73in + var(--printer-offset)); left: 6.10in; font-size: 15px; text-align: right; width: 1.8in; }
        .less-withholding { position: absolute; top: calc(9.01in + var(--printer-offset)); left: 6.10in; font-size: 15px; text-align: right; width: 1.8in; }
        .total-due       { position: absolute; top: calc(9.35in + var(--printer-offset)); left: 6.10in; font-size: 15px; font-weight: bold; text-align: right; width: 1.8in; }

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
        <img src="/invoice-template.png.jpg" alt="Invoice template" />
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
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=850,height=1100');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
