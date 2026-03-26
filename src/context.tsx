import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Category, Product, Announcement, StoreConfig, OrderItem, OrderFormData } from './types';
import {
  getCategories, getProducts, getAnnouncements, getConfig,
  saveCategories, saveProducts, saveAnnouncements, saveConfig,
  LS_KEYS,
} from './data';

// ─── App Context ─────────────────────────────────────────────────────────────

interface AppContextValue {
  // Data
  categories: Category[];
  products: Product[];
  announcements: Announcement[];
  config: StoreConfig;
  // Order
  orderItems: OrderItem[];
  addToOrder: (item: OrderItem) => void;
  removeFromOrder: (productId: string) => void;
  updateOrderItem: (productId: string, updates: Partial<OrderItem>) => void;
  clearOrder: () => void;
  // Admin
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  // Admin data mutations
  setCategories: (cats: Category[]) => void;
  setProducts: (prods: Product[]) => void;
  setAnnouncements: (anns: Announcement[]) => void;
  updateConfig: (cfg: StoreConfig) => void;
  // Toast
  showToast: (msg: string, type?: 'success' | 'error' | 'default') => void;
  // Views
  currentView: View;
  setView: (v: View) => void;
}

export type View = 'catalog' | 'login' | 'admin';

const AppContext = createContext<AppContextValue>(null!);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategoriesState] = useState<Category[]>(getCategories);
  const [products, setProductsState] = useState<Product[]>(getProducts);
  const [announcements, setAnnouncementsState] = useState<Announcement[]>(getAnnouncements);
  const [config, setConfigState] = useState<StoreConfig>(getConfig);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(() => !!sessionStorage.getItem(LS_KEYS.adminSession));
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: string }[]>([]);
  const [currentView, setCurrentView] = useState<View>(() =>
    sessionStorage.getItem(LS_KEYS.adminSession) ? 'admin' : 'catalog'
  );

  const setView = useCallback((v: View) => setCurrentView(v), []);

  const login = useCallback((username: string, password: string) => {
    if (username === 'admin' && password === 'cerezo2024') {
      sessionStorage.setItem(LS_KEYS.adminSession, '1');
      setIsAdmin(true);
      setCurrentView('admin');
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(LS_KEYS.adminSession);
    setIsAdmin(false);
    setCurrentView('catalog');
  }, []);

  const setCategories = useCallback((cats: Category[]) => {
    saveCategories(cats);
    setCategoriesState(cats);
  }, []);

  const setProducts = useCallback((prods: Product[]) => {
    saveProducts(prods);
    setProductsState(prods);
  }, []);

  const setAnnouncements = useCallback((anns: Announcement[]) => {
    saveAnnouncements(anns);
    setAnnouncementsState(anns);
  }, []);

  const updateConfig = useCallback((cfg: StoreConfig) => {
    saveConfig(cfg);
    setConfigState(cfg);
  }, []);

  const addToOrder = useCallback((item: OrderItem) => {
    setOrderItems(prev => {
      const idx = prev.findIndex(i => i.product.id === item.product.id && i.size.name === item.size.name);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + item.quantity };
        return copy;
      }
      return [...prev, item];
    });
  }, []);

  const removeFromOrder = useCallback((productId: string) => {
    setOrderItems(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateOrderItem = useCallback((productId: string, updates: Partial<OrderItem>) => {
    setOrderItems(prev => prev.map(i => i.product.id === productId ? { ...i, ...updates } : i));
  }, []);

  const clearOrder = useCallback(() => setOrderItems([]), []);

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'default' = 'default') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2800);
  }, []);

  return (
    <AppContext.Provider value={{
      categories, products, announcements, config,
      orderItems, addToOrder, removeFromOrder, updateOrderItem, clearOrder,
      isAdmin, login, logout,
      setCategories, setProducts, setAnnouncements, updateConfig,
      showToast,
      currentView, setView,
    }}>
      {children}
      {/* Global Toasts */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast${t.type !== 'default' ? ` toast--${t.type}` : ''}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
