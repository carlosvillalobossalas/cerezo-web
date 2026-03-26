import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useApp } from '../../context/AppContext';

export function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = login(username, password);
    if (ok) {
      navigate('/admin', { replace: true });
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  }

  return (
    <div
      className="min-h-dvh flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-bg) 60%)' }}
    >
      <div className="w-full max-w-sm bg-surface rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center text-[10px] font-semibold text-primary-dark mb-4">
            LOGO
          </div>
          <h1 className="font-heading text-3xl font-semibold text-text">Cerezo</h1>
          <p className="text-sm text-text-muted mt-1">Panel de administración</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5" htmlFor="login-user">
              Usuario
            </label>
            <input
              id="login-user"
              className="w-full px-4 py-3 rounded-md border border-border bg-surface text-text text-sm placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              type="text"
              autoComplete="username"
              placeholder="admin"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5" htmlFor="login-pass">
              Contraseña
            </label>
            <input
              id="login-pass"
              className="w-full px-4 py-3 rounded-md border border-border bg-surface text-text text-sm placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-md bg-primary text-white text-sm font-medium shadow-sm hover:bg-primary-dark active:scale-95 transition-all mt-2"
          >
            Ingresar
          </button>
        </form>

        <Link
          to="/"
          className="block text-center text-sm text-text-light hover:text-text-muted transition-colors mt-6"
        >
          ← Volver al catálogo
        </Link>
      </div>
    </div>
  );
}
