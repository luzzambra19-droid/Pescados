# App de pedidos y clientes — Mariscos

App para reemplazar el cuaderno + Excel: registrar clientes, pedidos y organizar el reparto del día por ciudad/sector.

## 1. Crear el proyecto en Supabase

1. Ve a https://supabase.com y crea una cuenta (puede ser con el correo de tu mamá).
2. "New project" → dale un nombre (ej. "mariscos-pedidos") y una contraseña de base de datos (guárdala).
3. Cuando el proyecto esté listo, entra a **SQL Editor** → **New query**, pega todo el contenido de `supabase/schema.sql` y ejecútalo (▶). Esto crea las tablas y los datos de ejemplo.
4. La app usa un login por PIN (como el de IMVMED): cada persona elige su nombre y escribe un PIN de 4 dígitos en vez de correo + contraseña. Por dentro, ese PIN es la contraseña de una cuenta con un correo interno fijo. Antes de crear los usuarios:
   - Ve a **Authentication → Sign In / Providers → Email** (o **Authentication → Policies**, el nombre exacto varía según la versión) y baja **Minimum password length** a `4`.
   - Ve a **Authentication → Users → Add user** y crea las 3 cuentas exactamente con estos correos (están escritos así en `lib/usuarios.ts`), usando como contraseña el PIN de 4 dígitos que cada uno elija:
     - `margarita@mariscos.local`
     - `luz@mariscos.local`
     - `arnoldo@mariscos.local`
   - Marca **Auto confirm user** en cada una para que no pidan confirmar por correo (son correos inventados, no reciben nada).
5. Ve a **Project Settings → API**. Copia:
   - **Project URL**
   - **anon public key**

## 2. Configurar el proyecto localmente

1. Copia `.env.local.example` a `.env.local`:
   ```
   cp .env.local.example .env.local
   ```
2. Pega ahí la URL y la anon key que copiaste de Supabase.
3. Instala dependencias y prueba local:
   ```
   npm install
   npm run dev
   ```
4. Abre http://localhost:3000 — debería pedir login.

## 3. Desplegar en Vercel

1. Sube este proyecto a un repositorio de GitHub (o usa `vercel` CLI directo desde esta carpeta).
2. En https://vercel.com → "Add New Project" → importa el repo.
3. En **Environment Variables** agrega las mismas dos variables: `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy. Vercel te da una URL pública — esa es la que usa tu mamá desde el celular (puede agregarla a la pantalla de inicio como si fuera una app).

## Qué hace la app

- **Pedidos**: crear un pedido nuevo (cliente + productos + cantidades), calcula el total solo. Reemplaza directamente el cuaderno.
- **Reparto**: pedidos pendientes/en reparto agrupados por ciudad y sector, para armar la ruta del día.
- **Clientes**: lista agrupada por ciudad/sector, alta de clientes nuevos.
- **Productos**: catálogo con precios, para no escribirlos a mano en cada pedido.
- Estado de cada pedido (pendiente → en reparto → entregado) y si está pagado o debe.

## Siguientes pasos posibles

- Editar/eliminar clientes y pedidos existentes (hoy solo se crean y se actualiza estado/pago).
- Historial de pagos por cliente (cuánto debe en total, no solo por pedido).
- Notificación o resumen para enviar por WhatsApp al cliente.
