import { Link } from 'react-router';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-sm border-b border-border">
      <div className="h-16 flex items-center justify-between px-6">
        {/* Left: logo + brand */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-md bg-primary-light flex items-center justify-center text-[10px] font-semibold text-primary-dark flex-shrink-0"
            aria-label="Logo Cerezo"
          >
            LOGO
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading text-xl font-semibold text-text">
              Cere<span className="text-primary">zo</span>
            </span>
            <span className="hidden sm:block text-[11px] text-text-light tracking-wide">
              Repostería artesanal
            </span>
          </div>
        </div>

        {/* Right: admin link */}
        <Link
          to="/admin/login"
          className="text-xs text-text-light hover:text-text-muted transition-colors"
          aria-label="Acceso administrador"
        >
          Admin
        </Link>
      </div>
    </header>
  );
}
