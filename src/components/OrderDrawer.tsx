import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { buildWhatsAppUrl, getMinDeliveryDate } from '../utils/whatsapp';
import type { OrderFormData } from '../types';

interface Props {
  onClose: () => void;
}

const inputClass = 'w-full px-4 py-3 rounded-md border border-border bg-surface text-text text-sm placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors';
const labelClass = 'block text-sm font-medium text-text-muted mb-1.5';

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

    window.open(buildWhatsAppUrl(formData, config.whatsappNumber), '_blank');
    clearOrder();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Formulario de pedido"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full sm:max-w-lg bg-surface rounded-t-2xl sm:rounded-2xl
        animate-[slideUp_0.35s_cubic-bezier(0.32,0.72,0,1)] sm:animate-[scaleIn_0.2s_ease]
        max-h-[92dvh] flex flex-col">

        {/* Handle (mobile) */}
        <div className="flex-shrink-0 flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <h2 className="font-heading text-xl font-semibold text-text">Tu Pedido</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-8 h-8 rounded-full bg-primary-light text-primary-dark text-sm flex items-center justify-center hover:bg-primary/20 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-6">

          {/* Products */}
          <section>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Productos seleccionados
            </p>

            {!hasItems ? (
              <div className="flex flex-col items-center py-8 text-center">
                <span className="text-4xl mb-3">🛍️</span>
                <p className="text-sm text-text-muted leading-relaxed">
                  Aún no has agregado productos.<br />
                  Explora el catálogo y agrega lo que te guste.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orderItems.map(item => (
                  <div
                    key={`${item.product.id}-${item.size.name}`}
                    className="bg-bg rounded-lg p-3 border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-primary-light">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">{item.product.name}</p>
                        <p className="text-xs text-text-muted">{item.size.name}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <p className="text-sm font-semibold text-text">
                          ${(item.size.price * item.quantity).toLocaleString()}
                        </p>
                        <button
                          onClick={() => removeFromOrder(item.product.id)}
                          aria-label={`Eliminar ${item.product.name}`}
                          className="w-6 h-6 rounded-full bg-red-50 text-red-400 text-xs flex items-center justify-center hover:bg-red-100 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      {/* Quantity control */}
                      <div className="flex items-center rounded-md border border-border overflow-hidden">
                        <button
                          className="w-8 h-8 flex items-center justify-center text-text-muted hover:bg-primary-light hover:text-primary-dark transition-colors text-lg leading-none"
                          onClick={() => {
                            if (item.quantity > 1) updateOrderItem(item.product.id, { quantity: item.quantity - 1 });
                            else removeFromOrder(item.product.id);
                          }}
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          className="w-8 h-8 flex items-center justify-center text-text-muted hover:bg-primary-light hover:text-primary-dark transition-colors text-lg leading-none"
                          onClick={() => updateOrderItem(item.product.id, { quantity: item.quantity + 1 })}
                        >
                          +
                        </button>
                      </div>

                      {/* Note input */}
                      <input
                        className="flex-1 px-3 py-1.5 rounded-md border border-border bg-surface text-xs text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        placeholder="Personalización (opcional)"
                        value={item.note}
                        onChange={e => updateOrderItem(item.product.id, { note: e.target.value })}
                      />
                    </div>
                  </div>
                ))}

                {/* Total */}
                <div className="flex items-center justify-between pt-2 px-1">
                  <span className="text-sm text-text-muted font-medium">Total estimado</span>
                  <span className="text-base font-bold text-text">${total.toLocaleString()} MXN</span>
                </div>
              </div>
            )}
          </section>

          {/* Customer info */}
          <section>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Datos de contacto
            </p>

            <div className="space-y-4">
              <div>
                <label className={labelClass} htmlFor="order-name">Nombre completo *</label>
                <input
                  id="order-name"
                  className={inputClass}
                  placeholder="Tu nombre"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="order-phone">WhatsApp / Teléfono *</label>
                <input
                  id="order-phone"
                  className={inputClass}
                  type="tel"
                  placeholder="55 0000 0000"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="order-date">Fecha de entrega deseada *</label>
                <input
                  id="order-date"
                  className={inputClass}
                  type="date"
                  min={getMinDeliveryDate()}
                  value={deliveryDate}
                  onChange={e => setDeliveryDate(e.target.value)}
                />
                <p className="text-xs text-text-light mt-1.5">
                  Los pedidos requieren al menos 48 h de anticipación.
                </p>
              </div>

              <div>
                <label className={labelClass} htmlFor="order-comments">Comentarios generales</label>
                <textarea
                  id="order-comments"
                  className={`${inputClass} resize-none min-h-[90px]`}
                  placeholder="Alergias, colores especiales, diseños, estilo de decoración..."
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* WhatsApp info */}
          <div className="bg-primary-muted rounded-md px-4 py-3">
            <p className="text-xs text-primary-dark leading-relaxed">
              📲 Al presionar el botón se abrirá WhatsApp con tu pedido listo para enviar. La tienda te confirmará disponibilidad, precio final y método de pago.
            </p>
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-lg bg-primary text-white text-base font-medium shadow-md hover:bg-primary-dark active:scale-[0.98] transition-all"
          >
            <span>💚</span>
            Enviar pedido por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
