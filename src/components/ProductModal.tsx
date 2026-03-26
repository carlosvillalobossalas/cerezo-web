import React, { useState } from 'react';
import { useApp } from '../context';
import type { Product } from '../types';

interface Props {
  onClose: () => void;
}

export function ProductModal({ onClose }: Props & { product: Product }) {
  // This is re-exported so App.tsx wires up the product prop
  return null;
}

// The real component used in App
export function ProductDetailModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { categories, addToOrder, showToast } = useApp();
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);

  const cat = categories.find(c => c.id === product.categoryId);
  const selectedSize = product.sizes[selectedSizeIdx];

  function handleAdd() {
    addToOrder({
      product,
      size: selectedSize,
      quantity: 1,
      note: '',
    });
    showToast(`${product.name} agregado al pedido`, 'success');
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={product.name}>
        <div className="modal__handle" />

        {/* Image */}
        <div className="modal__img">
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        </div>

        <div className="modal__body">
          {/* Category */}
          <p className="modal__category">
            {cat?.emoji} {cat?.name}
          </p>

          {/* Name & tags */}
          <h2 className="modal__title">{product.name}</h2>

          {product.tags?.map(tag => (
            <span key={tag} className="badge badge--limited" style={{ marginRight: 6, marginBottom: 10, display: 'inline-flex' }}>
              {tag}
            </span>
          ))}

          {/* Description */}
          <p className="modal__description">{product.description}</p>

          {/* Sizes */}
          <p className="modal__sizes-label">Selecciona tamaño / presentación</p>
          <div className="modal__sizes">
            {product.sizes.map((size, idx) => (
              <button
                key={size.name}
                className={`size-option${selectedSizeIdx === idx ? ' selected' : ''}`}
                onClick={() => setSelectedSizeIdx(idx)}
              >
                <span className="size-option__radio" />
                <span className="size-option__name">{size.name}</span>
                <span className="size-option__price">${size.price.toLocaleString()}</span>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="modal__actions">
            <button className="btn btn--ghost" onClick={onClose}>
              Cerrar
            </button>
            {product.available ? (
              <button className="btn btn--primary" onClick={handleAdd}>
                🛍️ Agregar al pedido
              </button>
            ) : (
              <button className="btn btn--outline" disabled style={{ flex: 1, opacity: 0.6 }}>
                No disponible
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
