import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

export function CategoriesSection() {
  const { categories, setCategories, showToast } = useApp();
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('🍰');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmoji, setEditEmoji] = useState('');

  const inputClass = 'w-full px-3 py-2.5 rounded-md border border-border bg-surface text-text text-sm placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors';

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
      <h1 className="font-heading text-3xl font-semibold text-text">Categorías</h1>
      <p className="text-sm text-text-muted mt-1 mb-6">Organiza tu catálogo con categorías personalizadas.</p>

      {/* Add form */}
      <div className="bg-surface rounded-xl border border-border p-5 mb-6">
        <p className="text-sm font-semibold text-text mb-4">Nueva categoría</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Emoji</label>
            <input
              className={inputClass}
              value={newEmoji}
              onChange={e => setNewEmoji(e.target.value)}
              maxLength={2}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-text-muted mb-1.5">Nombre</label>
            <input
              className={inputClass}
              placeholder="Ej: Tartas"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCategory()}
            />
          </div>
        </div>
        <button
          onClick={addCategory}
          className="mt-4 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-dark active:scale-95 transition-all shadow-sm"
        >
          + Agregar
        </button>
      </div>

      {/* Categories list */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat =>
          editId === cat.id ? (
            <div key={cat.id} className="flex items-center gap-2 p-2 bg-surface rounded-xl border border-primary/30 w-full sm:w-auto">
              <input
                className={`${inputClass} w-14 flex-shrink-0`}
                value={editEmoji}
                onChange={e => setEditEmoji(e.target.value)}
                maxLength={2}
              />
              <input
                className={inputClass}
                value={editName}
                onChange={e => setEditName(e.target.value)}
              />
              <button
                onClick={saveEdit}
                className="px-3 py-2 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors flex-shrink-0"
              >
                Guardar
              </button>
              <button
                onClick={() => setEditId(null)}
                className="px-3 py-2 rounded-md bg-primary-light text-primary-dark text-xs font-medium hover:bg-primary/20 transition-colors flex-shrink-0"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div
              key={cat.id}
              className="flex items-center gap-2 px-3 py-2 bg-surface rounded-full border border-border text-sm"
            >
              <span>{cat.emoji}</span>
              <span className="font-medium text-text">{cat.name}</span>
              <button
                onClick={() => { setEditId(cat.id); setEditName(cat.name); setEditEmoji(cat.emoji); }}
                aria-label="Editar categoría"
                className="text-text-muted hover:text-text transition-colors ml-1"
              >
                ✎
              </button>
              <button
                onClick={() => deleteCategory(cat.id)}
                aria-label="Eliminar categoría"
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                ✕
              </button>
            </div>
          )
        )}
      </div>

      {categories.length === 0 && (
        <div className="flex flex-col items-center py-12 text-center">
          <span className="text-4xl mb-3">🏷️</span>
          <p className="text-sm text-text-muted">No hay categorías aún. Crea la primera.</p>
        </div>
      )}
    </div>
  );
}
