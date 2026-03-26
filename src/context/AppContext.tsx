import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Category, Product, Announcement, StoreConfig, OrderItem } from '../types';
import {
  getCategories, getProducts, getAnnouncements, getConfig,
  saveCategories, saveProducts, saveAnnouncements, saveConfig,
  isAdminSession, setAdminSession, clearAdminSession,
} from '../lib/mock/storage';

interface Toast {
  id: number;
  msg: string;
  type: 'success' | 'error' | 'default';
}

interface AppContextValue {
  categories: Category[];
  products: Product[];
  announcements: Announcement[];
  config: StoreConfig;
  orderItems: OrderItem[];
  addToOrder: (item: OrderItem) => void;
  removeFromOrder: (productId: string) => void;
  updateOrderItem: (productId: string, updates: Partial<OrderItem>) => void;
  clearOrder: () => void;
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  setCategories: (cats: Category[]) => void;
  setProducts: (prods: Product[]) => void;
  setAnnouncements: (anns: Announcement[]) => void;
  updateConfig: (cfg: StoreConfig) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'default') => void;
}

const AppContext = createContext<AppContextValue>(null!);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategoriesState] = useState<Category[]>(getCategories);
  const [products, setProductsState] = useState<Product[]>(getProducts);
  const [announcements, setAnnouncementsState] = useState<Announcement[]>(getAnnouncements);
  const [config, setConfigState] = useState<StoreConfig>(getConfig);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(isAdminSession);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const login = useCallback((username: string, password: string) => {
    if (username === 'admin' && password === 'cerezo2024') {
      setAdminSession();
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    clearAdminSession();
    setIsAdmin(false);
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
    }}>
      {children}
      {/* Global Toasts */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={[
              'px-5 py-3 rounded-full text-sm font-medium shadow-lg animate-[fadeIn_0.2s_ease]',
              t.type === 'success' && 'bg-green-600 text-white',
              t.type === 'error' && 'bg-red-600 text-white',
              t.type === 'default' && 'bg-text text-white',
            ].filter(Boolean).join(' ')}
          >
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
