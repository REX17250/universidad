# Gestión Académica — Frontend

Interfaz web (Next.js + Tailwind) del backend de gestión académica universitaria (`proyecto1`).
Tiene tres vistas según el rol: **estudiante**, **docente** y **administrador**.

## Cómo correrlo

1. Levanta el backend y su base de datos (en `proyecto1`): `npm run db:up`, `npm run db:import` y `npm run start`.
2. Aquí:
   ```
   cp .env.example .env.local     # BACKEND_URL=http://localhost:3000
   npm install
   npm run dev                    # http://localhost:3001
   ```
3. Usuarios de prueba (todos con la clave `Secret123!`):

   | Rol | Nombre | Email |
   |---|---|---|
   | Administrador | Administrador | `admin@universidad.edu` |
   | Docente | Laura López | `laura.lopez89@universidad.edu` |
   | Estudiante | Juliana Herrera | `juliana.herrera147@universidad.edu` |

## Cómo está armado

- **Sesión:** el login guarda el token en una cookie `httpOnly`; el navegador nunca lo ve. `src/proxy.ts` revisa sesión y rol antes de cargar cada página. La seguridad real la valida el backend en cada llamada.
- **Sin CORS:** el navegador llama a `/api/...` de este mismo sitio y `src/app/api/[...path]/route.ts` reenvía al backend con el token.
- **Pantallas:** `src/app/(app)/estudiante`, `docente` y `admin`. Las comunes (notificaciones y cuenta) están en `(app)/notificaciones` y `(app)/cuenta`.
- **Administración:** casi todas las pantallas usan `src/components/admin/resource-manager.tsx` (tabla, filtros y formulario). Cada recurso solo define su configuración en `configs.tsx` y `operations.tsx`.
- **Diseño:** la paleta y la tipografía están en `src/app/globals.css` y `src/app/layout.tsx` (valores provisionales hasta tener los del Figma). No hay imágenes en servicios externos: los avatares son iniciales y la ilustración del login es un SVG local.

## Scripts

`npm run dev` · `npm run build` · `npm run start` · `npm run lint`
