import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

export function SettingsSection() {
  const { config, updateConfig, showToast } = useApp();
  const [number, setNumber] = useState(config.whatsappNumber);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateConfig({ ...config, whatsappNumber: number.trim() });
    showToast('Configuración guardada', 'success');
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-text">Configuración</h1>
      <p className="text-sm text-text-muted mt-1 mb-6">Ajustes generales de la tienda.</p>

      <form onSubmit={handleSave} className="bg-surface rounded-xl border border-border p-5 mb-6">
        <p className="text-sm font-semibold text-text mb-4">WhatsApp de la tienda</p>
        <div className="mb-5">
          <label
            className="block text-xs font-medium text-text-muted mb-1.5"
            htmlFor="wa-number"
          >
            Número de WhatsApp
          </label>
          <input
            id="wa-number"
            className="w-full px-3 py-2.5 rounded-md border border-border bg-surface text-text text-sm placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            placeholder="506XXXXXXXX"
            value={number}
            onChange={e => setNumber(e.target.value)}
          />
          <p className="text-xs text-text-light mt-1.5">
            Formato internacional sin + ni espacios. Ej: 50688888888 (Costa Rica)
          </p>
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-dark active:scale-95 transition-all shadow-sm"
        >
          💾 Guardar
        </button>
      </form>

      {/* Credentials info */}
      <div className="bg-surface rounded-xl border border-border p-5">
        <p className="text-sm font-semibold text-text mb-3">Credenciales de acceso</p>
        <p className="text-sm text-text-muted mb-3">
          Las credenciales actuales son:{' '}
          <code className="px-1.5 py-0.5 rounded bg-primary-light text-primary-dark text-xs">admin</code>
          {' '}/{' '}
          <code className="px-1.5 py-0.5 rounded bg-primary-light text-primary-dark text-xs">cerezo2024</code>
          .<br />
          Para cambiarlas integra Firebase Authentication (próxima versión).
        </p>
        <div className="bg-primary-muted rounded-md px-4 py-3">
          <p className="text-xs text-primary-dark">
            ⚠️ Esto es una demo. No usar en producción con estas credenciales fijas.
          </p>
        </div>
      </div>
    </div>
  );
}
