import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SiteHeader } from '../../components/SiteHeader';
import { ProductCard } from '../../components/ProductCard';
import { ProductModal } from '../../components/ProductModal';
import { OrderDrawer } from '../../components/OrderDrawer';
import type { Product } from '../../types';

export function CatalogPage() {
  const { categories, products, announcements, orderItems } = useApp();
  const [activeCat, setActiveCat] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderOpen, setOrderOpen] = useState(false);

  const activeAnnouncements = announcements.filter(a => a.active);
  const filtered = activeCat === 'all'
    ? products
    : products.filter(p => p.categoryId === activeCat);

  const totalQty = orderItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-dvh bg-bg">
      <SiteHeader />

      <main className="max-w-5xl mx-auto pb-28">

        {/* Announcements carousel */}
        {activeAnnouncements.length > 0 && (
          <section className="pt-5 pb-2">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider px-4 mb-3">
              Novedades
            </p>
            <div className="flex gap-4 overflow-x-auto px-4 pb-3 snap-x snap-mandatory scrollbar-none">
              {activeAnnouncements.map(ann => (
                <div
                  key={ann.id}
                  className="flex-shrink-0 w-72 bg-surface rounded-xl overflow-hidden shadow-sm border border-border snap-start"
                >
                  {ann.imageUrl && (
                    <div className="aspect-[16/7] overflow-hidden bg-primary-light">
                      <img
                        src={ann.imageUrl}
                        alt={ann.title}
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-heading text-base font-semibold text-text leading-snug">
                      {ann.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">{ann.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Catalog */}
        <section className="px-4 pt-4">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-heading text-2xl font-semibold text-text">Catálogo</h2>
            <span className="text-xs text-text-muted">{filtered.length} productos</span>
          </div>

          {/* Category tabs */}
          <div
            className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none"
            role="tablist"
          >
            <button
              className={[
                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                activeCat === 'all'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface text-text-muted border border-border hover:border-primary/50 hover:text-text',
              ].join(' ')}
              onClick={() => setActiveCat('all')}
              role="tab"
            >
              🍰 Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={[
                  'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  activeCat === cat.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface text-text-muted border border-border hover:border-primary/50 hover:text-text',
                ].join(' ')}
                onClick={() => setActiveCat(cat.id)}
                role="tab"
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>

          {/* Product grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <span className="text-5xl mb-4">🧁</span>
              <p className="font-heading text-xl font-semibold text-text mb-1">
                Sin productos en esta categoría
              </p>
              <p className="text-sm text-text-muted">
                Intenta con otra categoría o vuelve pronto.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-2">
              {filtered.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  category={categories.find(c => c.id === product.categoryId)}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* FAB */}
      <button
        className="fixed bottom-6 right-4 z-30 flex items-center gap-2 bg-primary text-white pl-4 pr-5 py-3.5 rounded-full shadow-lg hover:bg-primary-dark active:scale-95 transition-all duration-200 relative"
        onClick={() => setOrderOpen(true)}
        aria-label="Ver pedido"
      >
        🛍️
        {totalQty > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-text text-white text-[10px] font-bold flex items-center justify-center">
            {totalQty}
          </span>
        )}
        <span className="text-sm font-medium">
          {totalQty > 0 ? 'Mi pedido' : 'Hacer pedido'}
        </span>
      </button>

      {/* Modals */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      {orderOpen && <OrderDrawer onClose={() => setOrderOpen(false)} />}
    </div>
  );
}
