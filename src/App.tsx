import React, { useState } from 'react';
import { AppProvider, useApp } from './context';
import { SiteHeader } from './components/SiteHeader';
import { CatalogView } from './components/CatalogView';
import { OrderDrawer } from './components/OrderDrawer';
import { LoginPage } from './components/LoginPage';
import { AdminPanel } from './components/AdminPanel';

function AppContent() {
  const { currentView, orderItems } = useApp();
  const [orderOpen, setOrderOpen] = useState(false);
  const totalQty = orderItems.reduce((s, i) => s + i.quantity, 0);

  // Admin views don't use the site header or FAB
  if (currentView === 'login') return <LoginPage />;
  if (currentView === 'admin') return <AdminPanel />;

  // Catalog (customer view)
  return (
    <>
      <SiteHeader />
      <main>
        <CatalogView />
      </main>

      {/* FAB: open order drawer */}
      <button
        className="fab"
        onClick={() => setOrderOpen(true)}
        aria-label="Ver pedido"
        id="fab-order"
      >
        🛍️
        {totalQty > 0 && (
          <span className="fab__badge">{totalQty}</span>
        )}
        <span style={{ fontSize: '0.875rem' }}>
          {totalQty > 0 ? 'Mi pedido' : 'Hacer pedido'}
        </span>
      </button>

      {/* Order drawer */}
      {orderOpen && <OrderDrawer onClose={() => setOrderOpen(false)} />}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
