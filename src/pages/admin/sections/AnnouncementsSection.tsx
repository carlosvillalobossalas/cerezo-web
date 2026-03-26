import { useState, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import type { Announcement } from '../../../types';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const EMPTY_ANN = (): Omit<Announcement, 'id'> => ({
  title: '',
  body: '',
  imageUrl: '',
  active: true,
  createdAt: new Date().toISOString().split('T')[0],
});

const inputClass = 'w-full px-3 py-2.5 rounded-md border border-border bg-surface text-text text-sm placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors';
const labelClass = 'block text-xs font-medium text-text-muted mb-1.5';

export function AnnouncementsSection() {
  const { announcements, setAnnouncements, showToast } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Announcement, 'id'> & { id?: string }>(EMPTY_ANN());
  const fileRef = useRef<HTMLInputElement>(null);

  function startNew() {
    setForm(EMPTY_ANN());
    setEditId(null);
    setShowForm(true);
  }

  function startEdit(ann: Announcement) {
    setForm(ann);
    setEditId(ann.id);
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
    if (editId) {
      setAnnouncements(announcements.map(a => a.id === editId ? { ...form, id: editId } as Announcement : a));
      showToast('Anuncio actualizado', 'success');
    } else {
      setAnnouncements([...announcements, { ...form, id: 'a-' + Date.now() } as Announcement]);
      showToast('Anuncio creado', 'success');
    }
    setShowForm(false);
    setEditId(null);
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
      <div className="flex items-start justify-between mb-1">
        <h1 className="font-heading text-3xl font-semibold text-text">Anuncios</h1>
        {!showForm && (
          <button
            onClick={startNew}
            className="mt-1 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-dark active:scale-95 transition-all shadow-sm"
          >
            + Nuevo
          </button>
        )}
      </div>
      <p className="text-sm text-text-muted mb-6">Gestiona los anuncios y promociones visibles en el catálogo.</p>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSave} className="bg-surface rounded-xl border border-border p-5 mb-6 space-y-4">
          <p className="text-sm font-semibold text-text">
            {editId ? 'Editar anuncio' : 'Nuevo anuncio'}
          </p>

          <div>
            <label className={labelClass}>Título *</label>
            <input
              className={inputClass}
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Ej: ¡Nuevos sabores disponibles!"
              required
            />
          </div>

          <div>
            <label className={labelClass}>Descripción</label>
            <textarea
              className={`${inputClass} resize-none min-h-[80px]`}
              value={form.body}
              onChange={e => setForm({ ...form, body: e.target.value })}
              placeholder="Texto del anuncio..."
            />
          </div>

          {/* Image upload */}
          <div>
            <label className={labelClass}>Imagen (opcional)</label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-md border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer overflow-hidden"
            >
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="Preview" className="w-full h-32 object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <span className="text-2xl mb-1">📸</span>
                  <p className="text-xs text-text-muted">Haz clic para subir una imagen</p>
                </div>
              )}
            </div>
          </div>

          {/* Toggle */}
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-text">Visible en el catálogo</span>
            <div
              className={`relative w-10 h-6 rounded-full transition-colors ${form.active ? 'bg-primary' : 'bg-border-strong'}`}
              onClick={() => setForm({ ...form, active: !form.active })}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${form.active ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditId(null); }}
              className="px-4 py-2.5 rounded-md border border-border-strong text-text-muted text-sm font-medium hover:border-primary/50 hover:text-text transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-dark active:scale-95 transition-all shadow-sm"
            >
              {editId ? '💾 Guardar' : '+ Crear anuncio'}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {announcements.length === 0 && !showForm ? (
        <div className="flex flex-col items-center py-12 text-center">
          <span className="text-4xl mb-3">📢</span>
          <p className="font-heading text-xl text-text mb-1">Sin anuncios aún</p>
          <p className="text-sm text-text-muted">Crea tu primer anuncio o promoción.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {announcements.map(ann => (
            <div key={ann.id} className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-border">
              {ann.imageUrl && (
                <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-primary-light">
                  <img src={ann.imageUrl} alt={ann.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{ann.title}</p>
                <p className="text-xs text-text-muted mt-0.5">
                  {ann.active ? '🟢 Visible' : '⚫ Oculto'} · {ann.createdAt}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => toggleActive(ann.id)}
                  aria-label="Toggle visibilidad"
                  className="w-8 h-8 rounded-md bg-primary-light text-primary-dark text-sm flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  {ann.active ? '👁' : '🙈'}
                </button>
                <button
                  onClick={() => startEdit(ann)}
                  aria-label="Editar"
                  className="w-8 h-8 rounded-md bg-primary-light text-primary-dark text-sm flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDelete(ann.id)}
                  aria-label="Eliminar"
                  className="w-8 h-8 rounded-md bg-red-50 text-red-400 text-sm flex items-center justify-center hover:bg-red-100 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
