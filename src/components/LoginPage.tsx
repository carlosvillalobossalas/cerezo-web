import React, { useState } from 'react';
import { useApp } from '../context';

export function LoginPage() {
  const { login, setView } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = login(username, password);
    if (!ok) setError('Usuario o contraseña incorrectos.');
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo placeholder */}
        <div className="login-card__logo">LOGO</div>

        <h1 className="login-card__title">Cerezo</h1>
        <p className="login-card__subtitle">Panel de administración</p>

        <form className="login-card__form" onSubmit={handleSubmit} noValidate>
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="login-user">Usuario</label>
            <input
              id="login-user"
              className="form-input"
              type="text"
              autoComplete="username"
              placeholder="admin"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 22 }}>
            <label className="form-label" htmlFor="login-pass">Contraseña</label>
            <input
              id="login-pass"
              className="form-input"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              required
            />
          </div>

          <button className="btn btn--primary" type="submit" style={{ width: '100%' }}>
            Ingresar
          </button>
        </form>

        <button
          className="login-card__back"
          onClick={() => setView('catalog')}
        >
          ← Volver al catálogo
        </button>
      </div>
    </div>
  );
}
