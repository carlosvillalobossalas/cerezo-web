import React, { useState } from 'react';
import { useApp } from '../context';
import type { Product } from '../types';
import { ProductDetailModal } from './ProductModal';

export function CatalogView() {
  const { categories, products, announcements } = useApp();
  const [activeCat, setActiveCat] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const activeAnnouncements = announcements.filter(a => a.active);

  const filtered = activeCat === 'all'
    ? products.filter(p => p.available)
    : products.filter(p => p.categoryId === activeCat && p.available);

  return (
    <>
      {/* Announcements */}
      {activeAnnouncements.length > 0 && (
        <section className="announcements-section">
          <p className="announcements-section__title">Novedades</p>
          <div className="announcements-scroll">
            {activeAnnouncements.map(ann => (
              <div key={ann.id} className="announcement-card">
                {ann.imageUrl && (
                  <div className="announcement-card__img">
                    <img src={ann.imageUrl} alt={ann.title} loading="lazy" />
                  </div>
                )}
                <div className="announcement-card__body">
                  <h3 className="announcement-card__title">{ann.title}</h3>
                  <p className="announcement-card__text">{ann.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Catalog */}
      <section className="catalog-section">
        <div className="catalog-section__header">
          <h2 className="catalog-section__title">Catálogo</h2>
          <span className="catalog-section__count">{filtered.length} productos</span>
        </div>

        {/* Category tabs */}
        <div className="category-tabs" role="tablist">
          <button
            className={`category-tab${activeCat === 'all' ? ' active' : ''}`}
            onClick={() => setActiveCat('all')}
            role="tab"
          >
            🍰 Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-tab${activeCat === cat.id ? ' active' : ''}`}
              onClick={() => setActiveCat(cat.id)}
              role="tab"
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🧁</div>
            <p className="empty-state__title">Sin productos en esta categoría</p>
            <p className="empty-state__text">Intenta con otra categoría o vuelve pronto.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map(product => {
              const cat = categories.find(c => c.id === product.categoryId);
              return (
                <article
                  key={product.id}
                  className="product-card"
                  onClick={() => setSelectedProduct(product)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setSelectedProduct(product)}
                  aria-label={`Ver detalles de ${product.name}`}
                >
                  <div className="product-card__img">
                    <img src={product.imageUrl} alt={product.name} loading="lazy" />
                    {!product.available && (
                      <span className="product-card__unavailable-badge">No disponible</span>
                    )}
                  </div>
                  <div className="product-card__body">
                    <p className="product-card__category">{cat?.emoji} {cat?.name}</p>
                    <h3 className="product-card__name">{product.name}</h3>
                    {product.tags?.map(tag => (
                      <span key={tag} className="badge badge--limited">{tag}</span>
                    ))}
                    <p className="product-card__price">Desde ${product.basePrice.toLocaleString()}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Product modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
