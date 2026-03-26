import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useApp } from '../../context/AppContext';
import { ProductsSection } from './sections/ProductsSection';
import { CategoriesSection } from './sections/CategoriesSection';
import { AnnouncementsSection } from './sections/AnnouncementsSection';
import { SettingsSection } from './sections/SettingsSection';

type Section = 'products' | 'categories' | 'announcements' | 'settings';

const NAV_ITEMS: { id: Section; icon: string; label: string }[] = [
  { id: 'products', icon: '🧁', label: 'Productos' },
  { id: 'categories', icon: '🏷️', label: 'Categorías' },
  { id: 'announcements', icon: '📢', label: 'Anuncios' },
  { id: 'settings', icon: '⚙️', label: 'Config' },
];

export function AdminLayout() {
  const { isAdmin, logout } = useApp();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>('products');

  useEffect(() => {
    if (!isAdmin) navigate('/admin/login', { replace: true });
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const sections: Record<Section, React.ReactNode> = {
    products: <ProductsSection />,
    categories: <CategoriesSection />,
    announcements: <AnnouncementsSection />,
    settings: <SettingsSection />,
  };

  function handleLogout() {
    logout();
    navigate('/', { replace: true });
  }

  const navBtnClass = (id: Section) => [
    'flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors w-full text-left',
    section === id
      ? 'bg-primary-light text-primary-dark'
      : 'text-text-muted hover:bg-primary-light/50 hover:text-text',
  ].join(' ');

  const bottomNavBtnClass = (id: Section) => [
    'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors',
    section === id ? 'text-primary' : 'text-text-muted',
  ].join(' ');

  return (
    <div className="min-h-dvh bg-bg flex flex-col">
      {/* Header */}
      <header className="h-14 bg-surface border-b border-border flex items-center gap-3 px-4 sticky top-0 z-40 flex-shrink-0">
        <div className="w-8 h-8 rounded-md bg-primary-light flex items-center justify-center text-[9px] font-semibold text-primary-dark flex-shrink-0">
          LOGO
        </div>
        <span className="font-heading text-lg font-semibold text-text">
          Cere<span className="text-primary">zo</span>{' '}
          <span className="font-body text-sm font-normal text-text-muted">Admin</span>
        </span>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden sm:block text-xs text-text-muted">admin</span>
          <button
            onClick={handleLogout}
            className="text-xs text-text-muted hover:text-text transition-colors px-3 py-1.5 rounded-md hover:bg-primary-light"
          >
            Salir
          </button>
          <Link
            to="/"
            className="text-xs text-text-light hover:text-text-muted transition-colors"
          >
            Ver tienda →
          </Link>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar (desktop) */}
        <nav className="hidden md:flex flex-col w-56 bg-surface border-r border-border py-4 px-3 gap-1 flex-shrink-0">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={navBtnClass(item.id)}
              onClick={() => setSection(item.id)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 pb-24 md:pb-6">
          {sections[section]}
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-surface border-t border-border flex z-40">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={bottomNavBtnClass(item.id)}
            onClick={() => setSection(item.id)}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
