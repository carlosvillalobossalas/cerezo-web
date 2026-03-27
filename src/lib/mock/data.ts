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
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
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
    basePrice: 18000,
    sizes: [
      { name: 'Original', price: 18000 },
      { name: 'Grande (20 personas)', price: 25000 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600&q=80',
    available: true,
  },
  {
    id: 'p5',
    categoryId: 'cupcakes',
    name: 'Cupcakes Vainilla Fresa',
    description: 'Caja de 6 cupcakes de vainilla rellenos de mermelada de fresa casera.',
    imageUrl: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&q=80&w=800',
    available: true,
    basePrice: 9000,
    sizes: [
      { name: 'Caja de 6', price: 9000 },
      { name: 'Caja de 12', price: 17000 },
    ],
  },
  {
    id: 'p6',
    categoryId: 'galletas',
    name: 'Galletas Choco-Chips',
    description: 'Galletas estilo NY, crujientes por fuera y suaves por dentro.',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=800',
    available: true,
    basePrice: 7500,
    sizes: [
      { name: '1 docena', price: 7500 },
    ],
  },
  {
    id: 'p7',
    name: 'Flan Napolitano',
    categoryId: 'postres',
    description: 'Cremoso flan con caramelo dorado hecho en casa. Receta tradicional, sabor inigualable.',
    basePrice: 14000,
    sizes: [
      { name: 'Individual (250 g)', price: 3250 },
      { name: 'Familiar (1 kg)', price: 14000 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80',
    available: true,
  },
  {
    id: 'p8',
    name: 'Pastel de Flor de Cerezo 🌸',
    categoryId: 'temporada',
    description: 'Edición especial de primavera. Mousse de lychee y flor de cerezo, cubierto con pétalos comestibles. Disponible por tiempo limitado.',
    basePrice: 24000,
    sizes: [
      { name: 'Chico (15 cm · 8-10 porciones)', price: 24000 },
      { name: 'Mediano (20 cm · 15-18 porciones)', price: 35000 },
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
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80',
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
  whatsappNumber: '50688888888',
};
