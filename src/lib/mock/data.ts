import type { Category, Product, Announcement, StoreConfig } from '../../types';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'pasteles', name: 'Pasteles', emoji: '🎂' },
  { id: 'cupcakes', name: 'Cupcakes', emoji: '🧁' },
  { id: 'galletas', name: 'Galletas', emoji: '🍪' },
  { id: 'postres', name: 'Postres', emoji: '🍮' },
  { id: 'temporada', name: 'Temporada', emoji: '🌸' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Pastel Tres Leches',
    categoryId: 'pasteles',
    description: 'El clásico de siempre. Bizcocho esponjoso bañado en tres tipos de leche, cubierto con crema batida y una lluvia de canela.',
    basePrice: 350,
    sizes: [
      { name: 'Chico (15 cm · 8-10 porciones)', price: 350 },
      { name: 'Mediano (20 cm · 15-18 porciones)', price: 520 },
      { name: 'Grande (25 cm · 25-30 porciones)', price: 750 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1561390485-a3d013c48474?w=600&q=80',
    available: true,
  },
  {
    id: 'p2',
    name: 'Red Velvet',
    categoryId: 'pasteles',
    description: 'Terciopelo rojo con un sabor ligeramente achocolatado. Relleno y cubierto con frosting de queso crema perfectamente equilibrado.',
    basePrice: 390,
    sizes: [
      { name: 'Chico (15 cm · 8-10 porciones)', price: 390 },
      { name: 'Mediano (20 cm · 15-18 porciones)', price: 580 },
      { name: 'Grande (25 cm · 25-30 porciones)', price: 820 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=600&q=80',
    available: true,
  },
  {
    id: 'p3',
    name: 'Cheesecake de Frutos Rojos',
    categoryId: 'pasteles',
    description: 'Base de galleta, crema de queso suave y una cubierta de coulis de frutos rojos. Frescura en cada bocado.',
    basePrice: 420,
    sizes: [
      { name: 'Chico (15 cm · 8 porciones)', price: 420 },
      { name: 'Mediano (20 cm · 14 porciones)', price: 640 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80',
    available: true,
  },
  {
    id: 'p4',
    name: 'Cupcakes de Vainilla',
    categoryId: 'cupcakes',
    description: 'Esponjosos cupcakes de vainilla natural con buttercream sedoso. Disponibles en colores y decoraciones personalizadas.',
    basePrice: 35,
    sizes: [
      { name: 'Pieza', price: 35 },
      { name: 'Caja de 6', price: 195 },
      { name: 'Caja de 12', price: 370 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600&q=80',
    available: true,
  },
  {
    id: 'p5',
    name: 'Cupcakes de Chocolate',
    categoryId: 'cupcakes',
    description: 'Intensos y húmedos. Con ganache de chocolate oscuro y decoración de chispas. Para los amantes del chocolate.',
    basePrice: 38,
    sizes: [
      { name: 'Pieza', price: 38 },
      { name: 'Caja de 6', price: 210 },
      { name: 'Caja de 12', price: 395 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=600&q=80',
    available: true,
  },
  {
    id: 'p6',
    name: 'Galletas Decoradas',
    categoryId: 'galletas',
    description: 'Galletas de mantequilla con glasado real. Perfectas para regalos, eventos y celebraciones. ¡Personalizamos la temática!',
    basePrice: 25,
    sizes: [
      { name: 'Pieza', price: 25 },
      { name: 'Set de 6', price: 140 },
      { name: 'Set de 12', price: 265 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&q=80',
    available: true,
  },
  {
    id: 'p7',
    name: 'Flan Napolitano',
    categoryId: 'postres',
    description: 'Cremoso flan con caramelo dorado hecho en casa. Receta tradicional, sabor inigualable.',
    basePrice: 280,
    sizes: [
      { name: 'Individual (250 g)', price: 65 },
      { name: 'Familiar (1 kg)', price: 280 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80',
    available: true,
  },
  {
    id: 'p8',
    name: 'Pastel de Flor de Cerezo 🌸',
    categoryId: 'temporada',
    description: 'Edición especial de primavera. Mousse de lychee y flor de cerezo, cubierto con pétalos comestibles. Disponible por tiempo limitado.',
    basePrice: 480,
    sizes: [
      { name: 'Chico (15 cm · 8-10 porciones)', price: 480 },
      { name: 'Mediano (20 cm · 15-18 porciones)', price: 700 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80',
    tags: ['Edición Limitada'],
    available: true,
  },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: '🌸 ¡Colección Primavera ya disponible!',
    body: 'Celebra la temporada con nuestro nuevo Pastel de Flor de Cerezo. Solo por tiempo limitado. ¡No te lo pierdas!',
    imageUrl: 'https://images.unsplash.com/photo-1490323914169-4b6e491c661f?w=800&q=80',
    active: true,
    createdAt: '2026-03-20',
  },
  {
    id: 'a2',
    title: '🎉 Descuento en pedidos de 12+ cupcakes',
    body: 'Pide 12 o más cupcakes para tu próximo evento y recibe un 10% de descuento. ¡Escríbenos por WhatsApp!',
    imageUrl: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800&q=80',
    active: true,
    createdAt: '2026-03-15',
  },
];

export const DEFAULT_CONFIG: StoreConfig = {
  whatsappNumber: '521XXXXXXXXXX',
};
