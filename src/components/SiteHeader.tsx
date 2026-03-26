import React from 'react';
import { useApp } from '../context';

export function SiteHeader() {
  const { setView, currentView } = useApp();

  return (
    <header className="site-header">
      {/* Logo placeholder */}
      <div className="site-header__logo" aria-label="Logo Cerezo">
        LOGO
      </div>

      {/* Brand */}
      <div>
        <div className="site-header__name">
          Cere<span>zo</span>
        </div>
      </div>

      <span className="site-header__tagline">Repostería artesanal</span>

      {/* Subtle admin link */}
      {currentView === 'catalog' && (
        <button
          className="site-header__admin-link"
          onClick={() => setView('login')}
          aria-label="Acceso administrador"
        >
          Admin
        </button>
      )}
    </header>
  );
}
