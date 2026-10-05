import { formatMoney, type ShopSale } from "@/lib/shop";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function printSaleReceipt(sale: ShopSale) {
  const when = new Date(sale.createdAt).toLocaleString();
  const rows = sale.items
    .map(
      (item) => `
        <tr>
          <td>${item.qty} × ${escapeHtml(item.name)}</td>
          <td class="right">${escapeHtml(formatMoney(item.price * item.qty))}</td>
        </tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Receipt ${escapeHtml(sale.id)}</title>
    <style>
      @page { margin: 12mm; }
      body { margin: 0; font-family: "Courier New", ui-monospace, monospace; color: #1a140f; background: white; }
      .slip { width: 320px; margin: 0 auto; padding: 8px 0 24px; }
      h1 { margin: 0; text-align: center; font-size: 20px; letter-spacing: 0.14em; }
      .muted { text-align: center; color: #6b5c4d; font-size: 12px; }
      hr { border: none; border-top: 1px dashed #1a140f; margin: 12px 0; }
      table { width: 100%; border-collapse: collapse; font-size: 13px; }
      td { padding: 4px 0; vertical-align: top; }
      .right { text-align: right; white-space: nowrap; }
      .total { font-size: 16px; font-weight: 700; }
      .thanks { text-align: center; margin-top: 16px; font-size: 13px; }
    </style>
  </head>
  <body>
    <div class="slip">
      <h1>ATELIER</h1>
      <p class="muted">Showroom receipt</p>
      <p class="muted">${escapeHtml(when)}</p>
      <p class="muted">No. ${escapeHtml(sale.id)}</p>
      <hr />
      <table>${rows}</table>
      <hr />
      <table>
        <tr><td>Subtotal</td><td class="right">${escapeHtml(formatMoney(sale.subtotal))}</td></tr>
        <tr><td>Discount</td><td class="right">- ${escapeHtml(formatMoney(sale.discountAmount))}</td></tr>
        <tr class="total"><td>Total</td><td class="right">${escapeHtml(formatMoney(sale.total))}</td></tr>
        <tr><td>Paid by</td><td class="right">${escapeHtml(sale.payment)}</td></tr>
      </table>
      <p class="thanks">Thank you. Keep this slip.</p>
    </div>
  </body>
</html>`;

  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.position = "fixed";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  document.body.appendChild(frame);
  const doc = frame.contentDocument;
  const win = frame.contentWindow;
  if (!doc || !win) {
    frame.remove();
    return false;
  }
  doc.open();
  doc.write(html);
  doc.close();
  win.focus();
  win.print();
  window.setTimeout(() => frame.remove(), 1500);
  return true;
}
