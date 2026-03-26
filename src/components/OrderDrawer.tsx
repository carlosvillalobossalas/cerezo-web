import React, { useState } from 'react';
import { useApp } from '../context';
import type { OrderFormData } from '../types';

interface Props {
  onClose: () => void;
}

function buildWhatsAppText(form: OrderFormData, whatsappNumber: string): string {
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

  const encoded = encodeURIComponent(text);
  return `https://wa.me/${whatsappNumber}?text=${encoded}`;
}

export function OrderDrawer({ onClose }: Props) {
  const { orderItems, removeFromOrder, updateOrderItem, clearOrder, config } = useApp();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [comments, setComments] = useState('');

  const total = orderItems.reduce((sum, i) => sum + i.size.price * i.quantity, 0);
  const hasItems = orderItems.length > 0;

  function handleSend() {
    if (!customerName.trim()) return alert('Por favor ingresa tu nombre.');
    if (!customerPhone.trim()) return alert('Por favor ingresa tu número de teléfono.');
    if (!deliveryDate) return alert('Por favor selecciona una fecha de entrega.');
    if (!hasItems) return alert('Agrega al menos un producto al pedido.');

    const formData: OrderFormData = {
      customerName,
      customerPhone,
      deliveryDate,
      comments,
      items: orderItems,
    };
    const url = buildWhatsAppText(formData, config.whatsappNumber);
    window.open(url, '_blank');
    clearOrder();
    onClose();
  }

  // Today's date formatted for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="order-drawer" role="dialog" aria-modal="true" aria-label="Formulario de pedido">
      {/* Backdrop */}
      <div className="order-drawer__backdrop" onClick={onClose} />

      {/* Panel */}
      <div className="order-drawer__panel">
        <div className="order-drawer__handle" />

        {/* Header */}
        <div className="order-drawer__header">
          <h2 className="order-drawer__title">Tu Pedido</h2>
          <button className="order-drawer__close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className="order-drawer__body">
          {/* Products section */}
          <div className="order-section">
            <p className="order-section__title">Productos seleccionados</p>

            {!hasItems ? (
              <div className="order-empty">
                <div className="order-empty__icon">🛍️</div>
                <p className="order-empty__text">Aún no has agregado productos.<br />Explora el catálogo y agrega lo que te guste.</p>
              </div>
            ) : (
              <>
                {orderItems.map(item => (
                  <div key={`${item.product.id}-${item.size.name}`} className="order-item">
                    <div className="order-item__top">
                      <div className="order-item__img">
                        <img src={item.product.imageUrl} alt={item.product.name} />
                      </div>
                      <div className="order-item__info">
                        <p className="order-item__name">{item.product.name}</p>
                        <p className="order-item__size">{item.size.name}</p>
                      </div>
                      <p className="order-item__price">${(item.size.price * item.quantity).toLocaleString()}</p>
                      <button
                        className="order-item__remove"
                        onClick={() => removeFromOrder(item.product.id)}
                        aria-label={`Eliminar ${item.product.name}`}
                      >✕</button>
                    </div>

                    <div className="order-item__controls">
                      {/* Quantity control */}
                      <div className="qty-control">
                        <button
                          className="qty-btn"
                          onClick={() => {
                            if (item.quantity > 1) updateOrderItem(item.product.id, { quantity: item.quantity - 1 });
                            else removeFromOrder(item.product.id);
                          }}
                        >−</button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateOrderItem(item.product.id, { quantity: item.quantity + 1 })}
                        >+</button>
                      </div>

                      {/* Personalization note */}
                      <input
                        className="form-input"
                        style={{ flex: 1, fontSize: '0.8rem', padding: '7px 10px' }}
                        placeholder="Personalización (opcional)"
                        value={item.note}
                        onChange={e => updateOrderItem(item.product.id, { note: e.target.value })}
                      />
                    </div>
                  </div>
                ))}

                {/* Total */}
                <div className="order-total">
                  <span className="order-total__label">Total estimado</span>
                  <span className="order-total__value">${total.toLocaleString()} MXN</span>
                </div>
              </>
            )}
          </div>

          {/* Customer info section */}
          <div className="order-section">
            <p className="order-section__title">Datos de contacto</p>

            <div className="form-group">
              <label className="form-label" htmlFor="order-name">Nombre completo *</label>
              <input
                id="order-name"
                className="form-input"
                placeholder="Tu nombre"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="order-phone">WhatsApp / Teléfono *</label>
              <input
                id="order-phone"
                className="form-input"
                type="tel"
                placeholder="55 0000 0000"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="order-date">Fecha de entrega deseada *</label>
              <input
                id="order-date"
                className="form-input"
                type="date"
                min={today}
                value={deliveryDate}
                onChange={e => setDeliveryDate(e.target.value)}
              />
              <span className="form-note">Los pedidos requieren al menos 48 h de anticipación.</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="order-comments">Comentarios generales</label>
              <textarea
                id="order-comments"
                className="form-textarea"
                placeholder="Alergias, colores especiales, diseños, estilo de decoración..."
                value={comments}
                onChange={e => setComments(e.target.value)}
              />
            </div>
          </div>

          {/* WhatsApp note */}
          <div style={{
            background: 'var(--primary-muted)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            marginBottom: '20px',
          }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--primary-dark)', lineHeight: 1.6 }}>
              📲 Al presionar el botón se abrirá WhatsApp con tu pedido listo para enviar. La tienda te confirmará disponibilidad, precio final y método de pago.
            </p>
          </div>

          {/* Send button */}
          <button
            className="btn btn--primary"
            style={{ width: '100%', padding: '16px', fontSize: '1rem', gap: 10 }}
            onClick={handleSend}
          >
            <span>💚</span>
            Enviar pedido por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
