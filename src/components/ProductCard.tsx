import type { Product, Category } from '../types';

interface Props {
  product: Product;
  category: Category | undefined;
  onClick: () => void;
}

export function ProductCard({ product, category, onClick }: Props) {
  return (
    <article
      className="bg-surface rounded-lg overflow-hidden shadow-sm border border-border cursor-pointer
        hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={`Ver detalles de ${product.name}`}
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-primary-light relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!product.available && (
          <div className="absolute inset-0 bg-text/50 flex items-center justify-center">
            <span className="text-white text-xs font-semibold px-3 py-1 rounded-full bg-text/70">
              No disponible
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3">
        <p className="text-xs text-text-muted mb-1">
          {category?.emoji} {category?.name}
        </p>
        <h3 className="font-heading text-[1.1rem] font-semibold text-text leading-snug mb-1">
          {product.name}
        </h3>
        {product.tags?.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full bg-primary-light text-primary-dark font-medium mr-1 mb-1"
          >
            {tag}
          </span>
        ))}
        <p className="text-sm font-semibold text-primary mt-1">
          Desde ${product.basePrice.toLocaleString()}
        </p>
      </div>
    </article>
  );
}
