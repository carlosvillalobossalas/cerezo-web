import type { Category, Product, Announcement, StoreConfig } from '../../types';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_ANNOUNCEMENTS, DEFAULT_CONFIG } from './data';

export const LS_KEYS = {
  categories: 'cerezo_categories',
  products: 'cerezo_products',
  announcements: 'cerezo_announcements',
  config: 'cerezo_config',
  adminSession: 'cerezo_admin_session',
} as const;

export function getCategories(): Category[] {
  const stored = localStorage.getItem(LS_KEYS.categories);
  return stored ? JSON.parse(stored) : MOCK_CATEGORIES;
}

export function getProducts(): Product[] {
  const stored = localStorage.getItem(LS_KEYS.products);
  return stored ? JSON.parse(stored) : MOCK_PRODUCTS;
}

export function getAnnouncements(): Announcement[] {
  const stored = localStorage.getItem(LS_KEYS.announcements);
  return stored ? JSON.parse(stored) : MOCK_ANNOUNCEMENTS;
}

export function getConfig(): StoreConfig {
  const stored = localStorage.getItem(LS_KEYS.config);
  return stored ? JSON.parse(stored) : DEFAULT_CONFIG;
}

export function saveCategories(data: Category[]) {
  localStorage.setItem(LS_KEYS.categories, JSON.stringify(data));
}

export function saveProducts(data: Product[]) {
  localStorage.setItem(LS_KEYS.products, JSON.stringify(data));
}

export function saveAnnouncements(data: Announcement[]) {
  localStorage.setItem(LS_KEYS.announcements, JSON.stringify(data));
}

export function saveConfig(data: StoreConfig) {
  localStorage.setItem(LS_KEYS.config, JSON.stringify(data));
}

export function isAdminSession(): boolean {
  return !!sessionStorage.getItem(LS_KEYS.adminSession);
}

export function setAdminSession() {
  sessionStorage.setItem(LS_KEYS.adminSession, '1');
}

export function clearAdminSession() {
  sessionStorage.removeItem(LS_KEYS.adminSession);
}
