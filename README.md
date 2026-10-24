# Miami Caracas Express (MCE)

Marketplace de demostración inspirado en Amazon, construido con Laravel, Inertia.js, React y Tailwind CSS. Incluye catálogo de 18 productos, búsqueda, filtros por categoría, ofertas, carrito persistente, autenticación completa, notificaciones y un layout responsive con la paleta de colores de Amazon.

## Stack real del proyecto

| Capa | Versión |
| --- | --- |
| PHP | 8.5 |
| Laravel | 13 |
| Inertia.js | 3 |
| React | 19 + TypeScript |
| Tailwind CSS | 4 (`@theme` en `resources/css/app.css`) |
| Autenticación | Laravel Fortify (login, registro, reset, verificación, 2FA, passkeys) |
| Base de datos | SQLite |
| Bundler | Vite (Vite+) |

> Este proyecto partió del starter kit oficial React de Laravel. Por eso los componentes están en `.tsx` (no `.jsx`) y la configuración de Tailwind vive en `resources/css/app.css` mediante `@theme`, que es el mecanismo oficial de Tailwind v4. Se conservó Fortify en lugar de instalar Breeze para no perder 2FA, passkeys, verificación de correo ni las pantallas de configuración de cuenta.

## Instalación

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm run dev
```

En Laravel Herd basta con apuntar el sitio a la carpeta `public/` del proyecto (por ejemplo, `ecommerce.test`). No necesitas `php artisan serve`.

Para producción:

```bash
npm run build
```

## Cuentas de demostración

Todas usan la contraseña `password`:

| Correo | Nombre |
| --- | --- |
| `admin@mce.com` | Administrador MCE |
| `user@mce.com` | Cliente MCE |
| `maria@mce.com` | María Fernández |

Se crean con `php artisan db:seed --class=UserSeeder`.

## Autenticación

- Pantallas en español con el estilo visual del storefront: login, registro, recuperar contraseña, restablecer contraseña, verificación de correo, confirmación de contraseña y reto de 2FA.
- `AuthContext` global (`resources/js/contexts/AuthContext.tsx`) con `user`, `isAuthenticated`, `loading`, `login()`, `logout()`, `register()` y `loadUser()`.
- Validación en cliente y mensajes amigables en español desde `lang/es` y los Form Requests.
- Redirección al inicio (`/`) tras iniciar sesión o registrarse, respetando la URL `intended`.
- Opción «Recordarme», límite de 5 intentos por minuto y mensaje amigable al excederlo.
- Carrito de invitado persistido en `localStorage` que se fusiona con el carrito de la base de datos al iniciar sesión.

### Endpoints del carrito

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/cart` | Devuelve el carrito del usuario autenticado. |
| `POST` | `/api/cart/sync` | Fusiona el carrito de invitado con el guardado (máximo 99 por producto). |
| `PUT` | `/api/cart` | Reemplaza el carrito guardado. |

Requieren sesión iniciada; no se usan tokens de API.

## Funcionalidades del storefront

- **Header Amazon**: logo `MCE.com`, ubicación, buscador con selector de departamentos, cuenta con dropdown (Mi cuenta, Seguridad, Cerrar sesión), devoluciones, carrito con badge animado y nav de categorías.
- **Hero carousel**: 3 slides con autoplay de 6 segundos, navegación manual y dots.
- **Category cards** superpuestas al hero, incluyendo el bloque Prime.
- **Ofertas del día**: carrusel horizontal con scroll suave, descuentos y barra de oferta.
- **Grid de productos** con búsqueda en nombre/categoría/descripción y filtros tipo pill.
- **Modal de producto** con galería, precios, ahorro, entrega Prime, descripción y acciones.
- **Carrito lateral** con persistencia local + base de datos, control de cantidades, subtotal, regalo y checkout simulado.
- **Toasts** de confirmación, menú lateral de categorías, banners informativos, CTA para vendedores, footer y botón «Volver arriba».

## Estructura principal

```
app/Actions/Fortify/                       Creación y actualización de usuarios
app/Http/Controllers/Auth/                 Controladores de las vistas de autenticación
app/Http/Controllers/Api/CartController.php
app/Http/Requests/Auth/                    Validación de login y registro
app/Http/Requests/Cart/SyncCartRequest.php
app/Http/Controllers/HomeController.php    Controlador del storefront
app/Models/Product.php                     Modelo del catálogo
app/Models/CartItem.php                    Ítems del carrito persistente
database/migrations/*_create_products_table.php
database/migrations/*_create_cart_items_table.php
database/seeders/ProductSeeder.php         18 productos de demostración
database/seeders/UserSeeder.php            Cuentas de demostración
resources/css/app.css                      Tema Tailwind v4, colores y animaciones
resources/css/auth.css                     Estilos de las pantallas de autenticación
resources/js/app.tsx                       Entrada de Inertia + AuthProvider
resources/js/pages/home.tsx                Página principal
resources/js/pages/auth/                   Pantallas de autenticación
resources/js/layouts/                      Layouts del storefront y de autenticación
resources/js/contexts/                     Auth, Cart, Toast y Storefront
resources/js/components/storefront/        Componentes del marketplace
resources/js/components/auth/              Componentes de autenticación
```

## Notas

- El carrito de invitado se guarda bajo la clave `mce-cart-v1` en `localStorage`.
- Los gradientes de las tarjetas vienen de la base de datos; están declarados con `@source inline(...)` en `app.css` para que Tailwind v4 los incluya en el build.
- La tipografía es Roboto, cargada desde Google Fonts en `resources/views/app.blade.php`.
- Los mensajes de validación en español viven en `lang/es/`.
- La tienda está localizada para Venezuela: precios en bolívares (`Bs.`) con formato `es-VE`, envío a Caracas, métodos de pago locales y contenido del marketplace orientado a Venezuela.
