# Cerezo — Repostería Artesanal

Sitio web para una repostería. Los clientes navegan el catálogo y hacen pedidos que generan un mensaje de WhatsApp listo para enviar a la tienda — sin que el negocio tenga que estar pendiente del chat para levantar órdenes.

---

## Stack

- **React 19** + **TypeScript** (strict)
- **Vite** (bundler + dev server)
- **React Router v7** (routing)
- **Tailwind CSS v4** (estilos)
- **Firebase** (pendiente hasta confirmar con el cliente):
  - Firestore → catálogo, anuncios, configuración
  - Storage → imágenes de productos/anuncios
  - Auth → autenticación del admin
  - Hosting → deploy

**Estado actual**: demo con mock data y localStorage. No conectar Firebase hasta tener el sí del cliente.

---

## Rutas

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `CatalogPage` | Catálogo público con carrito y drawer de pedido |
| `/admin` | `AdminLayout` | Panel admin (guard: redirige a login si no autenticado) |
| `/admin/login` | `LoginPage` | Login del administrador |

El panel admin vive en `/admin` con sus sub-rutas (`/admin/products`, `/admin/categories`, etc.).

---

## Arquitectura

### Estructura de carpetas objetivo

```
src/
├── components/          # Componentes reutilizables (UI pura, sin lógica de negocio)
│   ├── ui/              # Primitivos: Button, Input, Modal, Badge, etc.
│   └── ...              # Componentes de dominio: ProductCard, OrderItem, etc.
├── pages/
│   ├── catalog/         # Vista pública del catálogo
│   └── admin/           # Panel de administración
│       ├── products/
│       ├── categories/
│       ├── announcements/
│       └── settings/
├── context/             # Context API (AppContext, OrderContext)
├── hooks/               # Custom hooks
├── lib/                 # Capa de datos (mock ahora, Firebase después)
│   ├── mock/            # Mock data y helpers de localStorage
│   └── firebase/        # (pendiente) Config y helpers de Firebase
├── types/               # Tipos TypeScript globales
└── utils/               # Utilidades puras (formato de WhatsApp, fechas, etc.)
```

### Capa de datos (`src/lib/`)

Toda la interacción con datos pasa por funciones en `src/lib/`. Hoy devuelven mock data de localStorage. Cuando llegue Firebase, solo se reemplaza la implementación de estas funciones — los componentes no cambian.

```typescript
// Ejemplo del contrato esperado
export async function getProducts(): Promise<Product[]> { ... }
export async function saveProduct(product: Product): Promise<void> { ... }
```

---

## Tipos principales

```typescript
interface Product {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  sizes: ProductSize[];      // Al menos uno requerido
  basePrice: number;         // Precio del size más barato
  imageUrl: string;
  tags?: string[];
  available: boolean;
}

interface ProductSize {
  name: string;              // e.g. "Chico 15cm", "12 piezas"
  price: number;
}

interface OrderItem {
  product: Product;
  size: ProductSize;
  quantity: number;
  note: string;              // Personalización del cliente
}

interface OrderFormData {
  customerName: string;
  customerPhone: string;
  deliveryDate: string;      // Mínimo 48h desde hoy
  comments: string;
  items: OrderItem[];
}
```

---

## Flujo de pedido (core del negocio)

1. Cliente navega el catálogo, filtra por categoría
2. Abre un producto → selecciona tamaño → agrega al carrito
3. FAB muestra conteo de items → abre el OrderDrawer
4. Cliente llena: nombre, teléfono, fecha de entrega (mín. 48h), comentarios
5. Al confirmar → se genera un mensaje de WhatsApp y se abre `wa.me/{número}?text={mensaje}`
6. El cliente envía el mensaje desde su propio WhatsApp

**El pedido no se guarda en ninguna base de datos** — la conversación de WhatsApp es el registro. Este es el comportamiento correcto y esperado.

### Formato del mensaje de WhatsApp

```
🎂 *Nuevo pedido - Cerezo*

👤 *Cliente:* {nombre}
📱 *Teléfono:* {teléfono}
📅 *Fecha de entrega:* {fecha}

*Productos:*
• {producto} - {tamaño} x{cantidad} — ${precio}
  📝 {nota si existe}

💰 *Total estimado: ${total}*

💬 *Comentarios:* {comentarios si existen}
```

---

## Panel de administración

Admin protegido por login. Demo: credenciales hardcodeadas. Producción: Firebase Auth.

**Secciones:**
- **Productos**: CRUD completo, subida de imagen desde dispositivo, toggle de disponibilidad, tamaños/precios dinámicos
- **Categorías**: CRUD, emoji + nombre
- **Anuncios**: CRUD, imagen opcional, toggle de visibilidad, se muestran en carrusel al tope del catálogo
- **Configuración**: Número de WhatsApp de la tienda

**Imágenes en el admin:**
- Demo: base64 en localStorage (funcional pero limitado en tamaño)
- Producción: Firebase Storage — la imagen se sube y se guarda la URL

---

## Diseño

### Paleta de colores

| Token | Valor | Uso |
|---|---|---|
| Primary | `#E8758A` | Botones, acentos, active states |
| Primary Dark | `#C45470` | Hover states |
| Primary Light | `#FAE8EC` | Fondos suaves, chips |
| Background | `#FDFAFA` | Fondo general |
| Surface | `#FFFFFF` | Tarjetas, modales |
| Text | `#1A1A1A` | Texto principal |
| Text Muted | `#8A7A7D` | Subtítulos, placeholders |

### Tipografía

- **Headings / nombre de marca**: Cormorant Garamond (serif) — carácter artesanal y elegante
- **UI / cuerpo**: Inter (sans-serif) — legibilidad en formularios y datos

### Principios de diseño

- **Mobile-first**: diseñar para móvil primero, escalar hacia arriba
- El catálogo y el flujo de pedido son la experiencia más importante — deben ser impecables en móvil
- El admin panel puede ser más funcional y menos estético — prioridad es usabilidad
- Modales y drawers se deslizan desde abajo en móvil, centrados en desktop
- FAB para abrir el carrito (no navbar): mantiene la pantalla limpia

---

## Reglas de negocio importantes

- La fecha de entrega mínima es **48 horas** desde el momento actual
- Un producto puede tener **múltiples tamaños** — el cliente elige al agregar al carrito
- Los productos **no disponibles** se muestran en el catálogo pero no se pueden agregar (con badge visible)
- Los anuncios se muestran en carrusel horizontal solo si están **activos**
- El número de WhatsApp de la tienda se configura en el admin (formato: `521XXXXXXXXXX`)

---

## Migración a Firebase (cuando aplique)

1. Reemplazar funciones en `src/lib/mock/` con implementaciones en `src/lib/firebase/`
2. Credenciales de admin → Firebase Auth (email/password)
3. Imágenes → Firebase Storage (upload + URL)
4. Sesión admin → `onAuthStateChanged` en lugar de sessionStorage
5. El número de WhatsApp pasa de hardcodeado a un documento en Firestore

No hay cambios necesarios en componentes ni en la lógica de negocio.

---

## Lo que NO hacer

- No conectar Firebase hasta que el cliente apruebe seguir con el proyecto
- No agregar librerías de UI externas (shadcn, MUI, etc.) — Tailwind es suficiente
- No guardar pedidos en ninguna base de datos — el flujo de WhatsApp es intencional
- No usar `any` en TypeScript
- No poner lógica de negocio en componentes — va en hooks o en `src/lib/`
- No hacer componentes gigantes — si un archivo pasa de ~200 líneas, dividir
- No agregar features no solicitadas ni "mejoras" cosméticas no pedidas
