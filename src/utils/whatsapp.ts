import type { OrderFormData } from '../types';

export function buildWhatsAppUrl(form: OrderFormData, whatsappNumber: string): string {
  const itemsText = form.items
    .map(item => {
      const line = `• ${item.product.name} (${item.size.name}) x${item.quantity} — $${(item.size.price * item.quantity).toLocaleString()}`;
      return item.note ? `${line}\n  ✏️ ${item.note}` : line;
    })
    .join('\n');

  const total = form.items.reduce((sum, i) => sum + i.size.price * i.quantity, 0);

  const text = `🌸 *PEDIDO — CEREZO* 🌸

👤 Cliente: ${form.customerName}
📱 Teléfono: ${form.customerPhone}
📅 Fecha de entrega: ${form.deliveryDate}

🧁 *Productos:*
${itemsText}

${form.comments ? `💬 Comentarios: ${form.comments}\n\n` : ''}💰 Total estimado: $${total.toLocaleString()} MXN

_Pedido generado desde cerezo.mx_`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function getMinDeliveryDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return date.toISOString().split('T')[0];
}
