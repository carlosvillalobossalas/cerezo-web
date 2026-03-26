import React, { useState, useRef } from 'react';
import { useApp } from '../context';
import type { Category, Product, ProductSize, Announcement } from '../types';

type AdminSection = 'products' | 'categories' | 'announcements' | 'settings';

const NAV_ITEMS: { id: AdminSection; icon: string; label: string }[] = [
  { id: 'products', icon: '🧁', label: 'Productos' },
  { id: 'categories', icon: '🏷️', label: 'Categorías' },
  { id: 'announcements', icon: '📢', label: 'Anuncios' },
  { id: 'settings', icon: '⚙️', label: 'Configuración' },
];

// ─── Image helpers ────────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Category manager ─────────────────────────────────────────────────────────

function CategoryManager() {
  const { categories, setCategories, showToast } = useApp();
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('🍰');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmoji, setEditEmoji] = useState('');

  function addCategory() {
    if (!newName.trim()) return;
    const id = newName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    setCategories([...categories, { id, name: newName.trim(), emoji: newEmoji }]);
    setNewName('');
    showToast('Categoría creada', 'success');
  }

  function deleteCategory(id: string) {
    if (!confirm('¿Eliminar esta categoría?')) return;
    setCategories(categories.filter(c => c.id !== id));
    showToast('Categoría eliminada');
  }

  function saveEdit() {
    if (!editId || !editName.trim()) return;
    setCategories(categories.map(c => c.id === editId ? { ...c, name: editName, emoji: editEmoji } : c));
    setEditId(null);
    showToast('Categoría actualizada', 'success');
  }

  return (
    <div>
      <h1 className="admin-content__title">Categorías</h1>
      <p className="admin-content__subtitle">Organiza tu catálogo con categorías personalizadas.</p>

      {/* Add form */}
      <div className="admin-form-card">
        <p className="admin-form-card__title">Nueva categoría</p>
        <div className="form-row form-row--3">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Emoji</label>
            <input className="form-input" value={newEmoji} onChange={e => setNewEmoji(e.target.value)} maxLength={2} />
          </div>
          <div className="form-group" style={{ marginBottom: 0, gridColumn: 'span 2' }}>
            <label className="form-label">Nombre</label>
            <input className="form-input" placeholder="Ej: Tartas" value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCategory()} />
          </div>
        </div>
        <button className="btn btn--primary btn--sm" style={{ marginTop: 14 }} onClick={addCategory}>
          + Agregar
        </button>
      </div>

      {/* List */}
      <div className="cats-grid">
        {categories.map(cat => (
          editId === cat.id ? (
            <div key={cat.id} className="admin-form-card" style={{ width: '100%', marginBottom: 0, padding: '14px 16px' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input className="form-input" value={editEmoji} onChange={e => setEditEmoji(e.target.value)} maxLength={2} style={{ width: 60 }} />
                <input className="form-input" value={editName} onChange={e => setEditName(e.target.value)} style={{ flex: 1 }} />
                <button className="btn btn--primary btn--sm" onClick={saveEdit}>Guardar</button>
                <button className="btn btn--ghost btn--sm" onClick={() => setEditId(null)}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div key={cat.id} className="cat-chip">
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 4 }}
                onClick={() => { setEditId(cat.id); setEditName(cat.name); setEditEmoji(cat.emoji); }}
                aria-label="Editar categoría"
              >✎</button>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: '#D32F2F' }}
                onClick={() => deleteCategory(cat.id)}
                aria-label="Eliminar categoría"
              >✕</button>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

// ─── Product Manager ──────────────────────────────────────────────────────────

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

function ProductForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<Product, 'id'> & { id?: string };
  onSave: (p: Omit<Product, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}) {
  const { categories } = useApp();
  const [form, setForm] = useState(initial);
  const fileRef = useRef<HTMLInputElement>(null);

  function updateSize(idx: number, updates: Partial<ProductSize>) {
    const sizes = form.sizes.map((s, i) => i === idx ? { ...s, ...updates } : s);
    setForm({ ...form, sizes });
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
    const b64 = await fileToBase64(file);
    setForm({ ...form, imageUrl: b64 });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return alert('El nombre es obligatorio.');
    if (!form.categoryId) return alert('Selecciona una categoría.');
    if (!form.sizes.length || !form.sizes[0].name) return alert('Agrega al menos un tamaño.');
    const basePrice = Math.min(...form.sizes.map(s => s.price));
    onSave({ ...form, basePrice });
  }

  return (
    <form className="admin-form-card" onSubmit={handleSubmit}>
      <p className="admin-form-card__title">{form.id ? 'Editar producto' : 'Nuevo producto'}</p>

      <div className="form-row form-row--2">
        <div className="form-group">
          <label className="form-label">Nombre *</label>
          <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej: Pastel Red Velvet" required />
        </div>
        <div className="form-group">
          <label className="form-label">Categoría *</label>
          <select className="form-select" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
            <option value="">Seleccionar...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Descripción</label>
        <textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe el producto..." />
      </div>

      {/* Image upload */}
      <div className="form-group">
        <label className="form-label">Imagen</label>
        <div className="img-upload" onClick={() => fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          {form.imageUrl ? (
            <img src={form.imageUrl} alt="Preview" className="img-upload__preview" />
          ) : (
            <>
              <div className="img-upload__icon">📸</div>
              <p className="img-upload__text">Haz clic para subir una foto</p>
            </>
          )}
        </div>
        {form.imageUrl && (
          <button type="button" className="btn btn--ghost btn--sm" style={{ marginTop: 8 }} onClick={() => setForm({ ...form, imageUrl: '' })}>
            Quitar imagen
          </button>
        )}
      </div>

      {/* Sizes */}
      <div className="form-group">
        <label className="form-label">Tamaños / Presentaciones *</label>
        <div className="sizes-list">
          {form.sizes.map((size, idx) => (
            <div key={idx} className="size-row">
              <input
                className="form-input"
                placeholder="Nombre (ej: Mediano 20cm)"
                value={size.name}
                onChange={e => updateSize(idx, { name: e.target.value })}
              />
              <input
                className="form-input form-input--price"
                type="number"
                min="0"
                placeholder="Precio"
                value={size.price || ''}
                onChange={e => updateSize(idx, { price: Number(e.target.value) })}
              />
              {form.sizes.length > 1 && (
                <button type="button" className="btn btn--danger btn--icon" onClick={() => removeSize(idx)} aria-label="Eliminar tamaño">✕</button>
              )}
            </div>
          ))}
        </div>
        <button type="button" className="btn btn--outline btn--sm" onClick={addSize}>+ Agregar tamaño</button>
      </div>

      {/* Available toggle */}
      <label className="toggle-row">
        <span className="toggle-label">Disponible en catálogo</span>
        <label className="toggle">
          <input
            type="checkbox"
            className="toggle__input"
            checked={form.available}
            onChange={e => setForm({ ...form, available: e.target.checked })}
          />
          <div className="toggle__track" />
          <div className="toggle__thumb" />
        </label>
      </label>

      <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
        <button type="button" className="btn btn--outline" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn--primary">
          {form.id ? '💾 Guardar cambios' : '+ Crear producto'}
        </button>
      </div>
    </form>
  );
}

function ProductManager() {
  const { products, setProducts, categories, showToast } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<(Omit<Product, 'id'> & { id?: string }) | null>(null);

  function handleSave(p: Omit<Product, 'id'> & { id?: string }) {
    if (p.id) {
      setProducts(products.map(pr => pr.id === p.id ? { ...p, id: p.id } as Product : pr));
      showToast('Producto actualizado', 'success');
    } else {
      const newProd: Product = { ...p, id: 'p-' + Date.now() };
      setProducts([...products, newProd]);
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

  if (showForm || editProduct) {
    return (
      <div>
        <h1 className="admin-content__title">{editProduct?.id ? 'Editar producto' : 'Nuevo producto'}</h1>
        <ProductForm
          initial={editProduct || EMPTY_PRODUCT()}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditProduct(null); }}
        />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
        <h1 className="admin-content__title">Productos</h1>
        <button className="btn btn--primary btn--sm" onClick={() => setShowForm(true)} style={{ marginTop: 6 }}>
          + Nuevo
        </button>
      </div>
      <p className="admin-content__subtitle">{products.length} productos en total</p>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🧁</div>
          <p className="empty-state__title">Sin productos aún</p>
          <p className="empty-state__text">Agrega tu primer producto.</p>
        </div>
      ) : (
        <div className="admin-list">
          {products.map(p => {
            const cat = categories.find(c => c.id === p.categoryId);
            return (
              <div key={p.id} className="admin-list-item">
                <div className="admin-list-item__img" style={{ background: p.imageUrl ? 'transparent' : 'var(--primary-light)' }}>
                  {p.imageUrl
                    ? <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '1.4rem' }}>🧁</span>
                  }
                </div>
                <div className="admin-list-item__info">
                  <p className="admin-list-item__name">{p.name}</p>
                  <p className="admin-list-item__meta">
                    {cat?.emoji} {cat?.name} · Desde ${p.basePrice.toLocaleString()}
                    {!p.available && ' · ⚠️ No disponible'}
                  </p>
                </div>
                <div className="admin-list-item__actions">
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => setEditProduct(p)}
                    aria-label="Editar"
                  >✎</button>
                  <button
                    className="btn btn--danger btn--sm"
                    onClick={() => handleDelete(p.id)}
                    aria-label="Eliminar"
                  >✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Announcement Manager ─────────────────────────────────────────────────────

const EMPTY_ANN = (): Omit<Announcement, 'id'> => ({
  title: '',
  body: '',
  imageUrl: '',
  active: true,
  createdAt: new Date().toISOString().split('T')[0],
});

function AnnouncementManager() {
  const { announcements, setAnnouncements, showToast } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editAnn, setEditAnn] = useState<(Omit<Announcement, 'id'> & { id?: string }) | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<Omit<Announcement, 'id'> & { id?: string }>(EMPTY_ANN());

  function startNew() {
    setForm(EMPTY_ANN());
    setEditAnn(null);
    setShowForm(true);
  }

  function startEdit(ann: Announcement) {
    setForm(ann);
    setEditAnn(ann);
    setShowForm(true);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    setForm(f => ({ ...f, imageUrl: b64 }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return alert('El título es obligatorio.');
    if (form.id) {
      setAnnouncements(announcements.map(a => a.id === form.id ? { ...form, id: form.id } as Announcement : a));
      showToast('Anuncio actualizado', 'success');
    } else {
      setAnnouncements([...announcements, { ...form, id: 'a-' + Date.now() } as Announcement]);
      showToast('Anuncio creado', 'success');
    }
    setShowForm(false);
  }

  function handleDelete(id: string) {
    if (!confirm('¿Eliminar este anuncio?')) return;
    setAnnouncements(announcements.filter(a => a.id !== id));
    showToast('Anuncio eliminado');
  }

  function toggleActive(id: string) {
    setAnnouncements(announcements.map(a => a.id === id ? { ...a, active: !a.active } : a));
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
        <h1 className="admin-content__title">Anuncios</h1>
        {!showForm && (
          <button className="btn btn--primary btn--sm" onClick={startNew} style={{ marginTop: 6 }}>
            + Nuevo
          </button>
        )}
      </div>
      <p className="admin-content__subtitle">Gestiona los anuncios y promociones visibles en el catálogo.</p>

      {/* Form */}
      {showForm && (
        <form className="admin-form-card" onSubmit={handleSave}>
          <p className="admin-form-card__title">{editAnn ? 'Editar anuncio' : 'Nuevo anuncio'}</p>
          <div className="form-group">
            <label className="form-label">Título *</label>
            <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ej: ¡Nuevos sabores disponibles!" required />
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea className="form-textarea" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Texto del anuncio..." />
          </div>
          <div className="form-group">
            <label className="form-label">Imagen (opcional)</label>
            <div className="img-upload" onClick={() => fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="Preview" className="img-upload__preview" />
              ) : (
                <>
                  <div className="img-upload__icon">📸</div>
                  <p className="img-upload__text">Haz clic para subir una imagen</p>
                </>
              )}
            </div>
          </div>
          <label className="toggle-row">
            <span className="toggle-label">Visible en el catálogo</span>
            <label className="toggle">
              <input type="checkbox" className="toggle__input" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
              <div className="toggle__track" />
              <div className="toggle__thumb" />
            </label>
          </label>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button type="button" className="btn btn--outline" onClick={() => setShowForm(false)}>Cancelar</button>
            <button type="submit" className="btn btn--primary">{editAnn ? '💾 Guardar' : '+ Crear anuncio'}</button>
          </div>
        </form>
      )}

      {/* List */}
      {announcements.length === 0 && !showForm ? (
        <div className="empty-state">
          <div className="empty-state__icon">📢</div>
          <p className="empty-state__title">Sin anuncios aún</p>
          <p className="empty-state__text">Crea tu primer anuncio o promoción.</p>
        </div>
      ) : (
        <div className="admin-list">
          {announcements.map(ann => (
            <div key={ann.id} className="admin-list-item">
              {ann.imageUrl && (
                <div className="admin-list-item__img">
                  <img src={ann.imageUrl} alt={ann.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div className="admin-list-item__info">
                <p className="admin-list-item__name">{ann.title}</p>
                <p className="admin-list-item__meta">
                  {ann.active ? '🟢 Visible' : '⚫ Oculto'} · {ann.createdAt}
                </p>
              </div>
              <div className="admin-list-item__actions">
                <button className="btn btn--ghost btn--sm" onClick={() => toggleActive(ann.id)} aria-label="Toggle visibilidad">
                  {ann.active ? '👁' : '🙈'}
                </button>
                <button className="btn btn--ghost btn--sm" onClick={() => startEdit(ann)} aria-label="Editar">✎</button>
                <button className="btn btn--danger btn--sm" onClick={() => handleDelete(ann.id)} aria-label="Eliminar">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────

function SettingsPanel() {
  const { config, updateConfig, showToast } = useApp();
  const [number, setNumber] = useState(config.whatsappNumber);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateConfig({ ...config, whatsappNumber: number.trim() });
    showToast('Configuración guardada', 'success');
  }

  return (
    <div>
      <h1 className="admin-content__title">Configuración</h1>
      <p className="admin-content__subtitle">Ajustes generales de la tienda.</p>

      <form className="settings-card" onSubmit={handleSave}>
        <div className="form-group" style={{ marginBottom: 20 }}>
          <label className="form-label" htmlFor="wa-number">Número de WhatsApp</label>
          <input
            id="wa-number"
            className="form-input"
            placeholder="521XXXXXXXXXX"
            value={number}
            onChange={e => setNumber(e.target.value)}
          />
          <span className="form-note">
            Formato internacional sin + ni espacios. Ej: 5215512345678 (México)
          </span>
        </div>
        <button type="submit" className="btn btn--primary">
          💾 Guardar
        </button>
      </form>

      <div style={{ marginTop: 32 }}>
        <div className="admin-form-card">
          <p className="admin-form-card__title">Credenciales de acceso</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 10 }}>
            Las credenciales actuales son: <code>admin</code> / <code>cerezo2024</code>.<br/>
            Para cambiarlas integra Firebase Authentication (próxima versión).
          </p>
          <div style={{ background: 'var(--primary-muted)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: '0.78rem', color: 'var(--primary-dark)' }}>
            ⚠️ Esto es una demo. No usar en producción con estas credenciales fijas.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Panel (main) ───────────────────────────────────────────────────────

export function AdminPanel() {
  const { logout } = useApp();
  const [section, setSection] = useState<AdminSection>('products');

  const sectionComponent: Record<AdminSection, React.ReactNode> = {
    products: <ProductManager />,
    categories: <CategoryManager />,
    announcements: <AnnouncementManager />,
    settings: <SettingsPanel />,
  };

  return (
    <div className="admin-layout">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-header__logo">LOGO</div>
        <div className="admin-header__brand">Cere<span>zo</span> <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)', fontFamily: 'Inter' }}>Admin</span></div>
        <span className="admin-header__user">admin</span>
        <button className="admin-header__logout" onClick={logout}>Salir</button>
      </header>

      <div className="admin-body">
        {/* Sidebar */}
        <nav className="admin-sidebar">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-item${section === item.id ? ' active' : ''}`}
              onClick={() => setSection(item.id)}
            >
              <span className="nav-item__icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main className="admin-content">
          {sectionComponent[section]}
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="admin-bottom-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-item${section === item.id ? ' active' : ''}`}
            onClick={() => setSection(item.id)}
          >
            <span className="nav-item__icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
