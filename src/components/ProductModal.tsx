import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Product } from '../types';

interface Props {
  product: Product;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: Props) {
  const { categories, addToOrder, showToast } = useApp();
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);

  const cat = categories.find(c => c.id === product.categoryId);
  const selectedSize = product.sizes[selectedSizeIdx];

  function handleAdd() {
    addToOrder({ product, size: selectedSize, quantity: 1, note: '' });
    showToast(`${product.name} agregado al pedido`, 'success');
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full sm:max-w-lg bg-surface rounded-t-2xl sm:rounded-2xl overflow-hidden
        animate-[slideUp_0.35s_cubic-bezier(0.32,0.72,0,1)] sm:animate-[scaleIn_0.2s_ease]
        max-h-[90dvh] flex flex-col">

        {/* Handle (mobile only) */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-border sm:hidden z-10" />

        {/* Image */}
        <div className="aspect-video overflow-hidden flex-shrink-0 bg-primary-light">
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto">
          <p className="text-xs text-text-muted">
            {cat?.emoji} {cat?.name}
          </p>
          <h2 className="font-heading text-2xl font-semibold text-text mt-1 leading-snug">
            {product.name}
          </h2>
          {product.tags?.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full bg-primary-light text-primary-dark font-medium mr-1 mt-2"
            >
              {tag}
            </span>
          ))}
          <p className="text-sm text-text-muted mt-3 leading-relaxed">
            {product.description}
          </p>

          {/* Size selector */}
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mt-5 mb-3">
            Tamaño / Presentación
          </p>
          <div className="flex flex-col gap-2">
            {product.sizes.map((size, idx) => {
              const selected = selectedSizeIdx === idx;
              return (
                <button
                  key={size.name}
                  onClick={() => setSelectedSizeIdx(idx)}
                  className={[
                    'w-full flex items-center gap-3 p-3 rounded-md border text-left transition-all',
                    selected
                      ? 'border-primary bg-primary-light'
                      : 'border-border hover:border-primary/50 bg-surface',
                  ].join(' ')}
                >
                  <span className={[
                    'w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors',
                    selected ? 'border-primary bg-primary' : 'border-border-strong',
                  ].join(' ')} />
                  <span className={[
                    'flex-1 text-sm',
                    selected ? 'text-primary-dark font-medium' : 'text-text',
                  ].join(' ')}>
                    {size.name}
                  </span>
                  <span className={[
                    'text-sm font-semibold',
                    selected ? 'text-primary-dark' : 'text-text',
                  ].join(' ')}>
                    ${size.price.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-md bg-primary-light text-primary-dark text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              Cerrar
            </button>
            {product.available ? (
              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-primary text-white text-sm font-medium shadow-sm hover:bg-primary-dark active:scale-95 transition-all"
              >
                🛍️ Agregar al pedido
              </button>
            ) : (
              <button
                disabled
                className="flex-1 px-5 py-3 rounded-md border border-border text-text-muted text-sm font-medium opacity-60 cursor-not-allowed"
              >
                No disponible
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
