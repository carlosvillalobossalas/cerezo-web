import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AppProvider } from './context/AppContext';
import { CatalogPage } from './pages/catalog/CatalogPage';
import { LoginPage } from './pages/admin/LoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={import.meta.env.DEV ? '/' : '/cerezo-web/'}>
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
