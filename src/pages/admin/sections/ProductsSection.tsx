import { useState, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import type { Product, ProductSize } from '../../../types';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const EMPTY_PRODUCT = (): Omit<Product, 'id'> => ({
  name: '',
  categoryId: '',
  description: '',
  basePrice: 0,
  sizes: [{ name: '', price: 0 }],
  imageUrl: '',
  tags: [],
  available: true,
});

const inputClass = 'w-full px-3 py-2.5 rounded-md border border-border bg-surface text-text text-sm placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors';
const labelClass = 'block text-xs font-medium text-text-muted mb-1.5';

// ─── Product Form ──────────────────────────────────────────────────────────────

interface ProductFormProps {
  initial: Omit<Product, 'id'> & { id?: string };
  onSave: (p: Omit<Product, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

function ProductForm({ initial, onSave, onCancel }: ProductFormProps) {
  const { categories } = useApp();
  const [form, setForm] = useState(initial);
  const fileRef = useRef<HTMLInputElement>(null);

  function updateSize(idx: number, updates: Partial<ProductSize>) {
    setForm({ ...form, sizes: form.sizes.map((s, i) => i === idx ? { ...s, ...updates } : s) });
  }

  function addSize() {
    setForm({ ...form, sizes: [...form.sizes, { name: '', price: 0 }] });
  }

  function removeSize(idx: number) {
    setForm({ ...form, sizes: form.sizes.filter((_, i) => i !== idx) });
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({ ...form, imageUrl: await fileToBase64(file) });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return alert('El nombre es obligatorio.');
    if (!form.categoryId) return alert('Selecciona una categoría.');
    if (!form.sizes.length || !form.sizes[0].name) return alert('Agrega al menos un tamaño.');
    onSave({ ...form, basePrice: Math.min(...form.sizes.map(s => s.price)) });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-5 space-y-4">
      <p className="text-sm font-semibold text-text">
        {form.id ? 'Editar producto' : 'Nuevo producto'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nombre *</label>
          <input
            className={inputClass}
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Ej: Pastel Red Velvet"
            required
          />
        </div>
        <div>
          <label className={labelClass}>Categoría *</label>
          <select
            className={inputClass}
            value={form.categoryId}
            onChange={e => setForm({ ...form, categoryId: e.target.value })}
            required
          >
            <option value="">Seleccionar...</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Descripción</label>
        <textarea
          className={`₡{inputClass} resize-none min-h-[80px]`}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Describe el producto..."
        />
      </div>

      {/* Image upload */}
      <div>
        <label className={labelClass}>Imagen</label>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <div
          onClick={() => fileRef.current?.click()}
          className="w-full rounded-md border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer overflow-hidden"
        >
          {form.imageUrl ? (
            <img src={form.imageUrl} alt="Preview" className="w-full h-36 object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <span className="text-3xl mb-2">📸</span>
              <p className="text-xs text-text-muted">Haz clic para subir una foto</p>
            </div>
          )}
        </div>
        {form.imageUrl && (
          <button
            type="button"
            onClick={() => setForm({ ...form, imageUrl: '' })}
            className="mt-2 text-xs text-text-muted hover:text-red-500 transition-colors"
          >
            Quitar imagen
          </button>
        )}
      </div>

      {/* Sizes */}
      <div>
        <label className={labelClass}>Tamaños / Presentaciones *</label>
        <div className="space-y-2 mb-2">
          {form.sizes.map((size, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                className={inputClass}
                placeholder="Nombre (ej: Mediano 20cm)"
                value={size.name}
                onChange={e => updateSize(idx, { name: e.target.value })}
              />
              <input
                className={`₡{inputClass} w-28 flex-shrink-0`}
                type="number"
                min="0"
                placeholder="Precio"
                value={size.price || ''}
                onChange={e => updateSize(idx, { price: Number(e.target.value) })}
              />
              {form.sizes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSize(idx)}
                  aria-label="Eliminar tamaño"
                  className="w-8 h-8 rounded-md bg-red-50 text-red-400 text-sm flex items-center justify-center hover:bg-red-100 transition-colors flex-shrink-0"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSize}
          className="text-xs px-3 py-2 rounded-md border border-border-strong text-text-muted hover:border-primary/50 hover:text-primary transition-colors"
        >
          + Agregar tamaño
        </button>
      </div>

      {/* Available toggle */}
      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm text-text">Disponible en catálogo</span>
        <div
          className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ₡{form.available ? 'bg-primary' : 'bg-border-strong'}`}
          onClick={() => setForm({ ...form, available: !form.available })}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ₡{form.available ? 'translate-x-5' : 'translate-x-1'}`} />
        </div>
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-md border border-border-strong text-text-muted text-sm font-medium hover:border-primary/50 hover:text-text transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2.5 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-dark active:scale-95 transition-all shadow-sm"
        >
          {form.id ? '💾 Guardar cambios' : '+ Crear producto'}
        </button>
      </div>
    </form>
  );
}

// ─── Products Section ─────────────────────────────────────────────────────────

export function ProductsSection() {
  const { products, setProducts, categories, showToast } = useApp();
  const [editProduct, setEditProduct] = useState<(Omit<Product, 'id'> & { id?: string }) | null>(null);
  const [showForm, setShowForm] = useState(false);

  function handleSave(p: Omit<Product, 'id'> & { id?: string }) {
    if (p.id) {
      setProducts(products.map(pr => pr.id === p.id ? { ...p, id: p.id } as Product : pr));
      showToast('Producto actualizado', 'success');
    } else {
      setProducts([...products, { ...p, id: 'p-' + Date.now() }]);
      showToast('Producto creado', 'success');
    }
    setShowForm(false);
    setEditProduct(null);
  }

  function handleDelete(id: string) {
    if (!confirm('¿Eliminar este producto?')) return;
    setProducts(products.filter(p => p.id !== id));
    showToast('Producto eliminado');
  }

  function startEdit(p: Product) {
    setEditProduct(p);
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <h1 className="font-heading text-3xl font-semibold text-text">Productos</h1>
        {!showForm && (
          <button
            onClick={() => { setEditProduct(null); setShowForm(true); }}
            className="mt-1 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-dark active:scale-95 transition-all shadow-sm"
          >
            + Nuevo
          </button>
        )}
      </div>
      <p className="text-sm text-text-muted mb-6">{products.length} productos en total</p>

      {showForm && (
        <div className="mb-6">
          <ProductForm
            initial={editProduct || EMPTY_PRODUCT()}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditProduct(null); }}
          />
        </div>
      )}

      {products.length === 0 && !showForm ? (
        <div className="flex flex-col items-center py-12 text-center">
          <span className="text-4xl mb-3">🧁</span>
          <p className="font-heading text-xl text-text mb-1">Sin productos aún</p>
          <p className="text-sm text-text-muted">Agrega tu primer producto.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map(p => {
            const cat = categories.find(c => c.id === p.categoryId);
            return (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-border">
                <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-primary-light">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🧁</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">{p.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {cat?.emoji} {cat?.name} · Desde ₡{p.basePrice.toLocaleString()}
                    {!p.available && (
                      <span className="text-amber-500 ml-1">· No disponible</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => startEdit(p)}
                    aria-label="Editar"
                    className="w-8 h-8 rounded-md bg-primary-light text-primary-dark text-sm flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    aria-label="Eliminar"
                    className="w-8 h-8 rounded-md bg-red-50 text-red-400 text-sm flex items-center justify-center hover:bg-red-100 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
