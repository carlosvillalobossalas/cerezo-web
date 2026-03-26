export interface ProductSize {
  name: string; // e.g. "Chico 15cm", "Mediano 20cm"
  price: number;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  sizes: ProductSize[];
  basePrice: number;
  imageUrl: string;
  tags?: string[];
  available: boolean;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
}

export interface StoreConfig {
  whatsappNumber: string; // e.g. "521XXXXXXXXXX"
}

export interface OrderItem {
  product: Product;
  size: ProductSize;
  quantity: number;
  note: string;
}

export interface OrderFormData {
  customerName: string;
  customerPhone: string;
  deliveryDate: string;
  comments: string;
  items: OrderItem[];
}
