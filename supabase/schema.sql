-- Esquema para la app de gestión de clientes y pedidos
-- Ejecutar en el SQL Editor de Supabase (Project > SQL Editor > New query)

-- ============ TABLAS ============

create table clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text,
  ciudad text not null,
  sector text not null,
  direccion text,
  notas text,
  activo boolean not null default true,
  bloqueado boolean not null default false,
  bloqueado_motivo text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  unidad text not null default 'kg', -- kg, unidad, caja, etc.
  precio numeric(10,2) not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create table pedidos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete restrict,
  fecha date not null default current_date,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'en_reparto', 'entregado')),
  pagado boolean not null default false,
  total numeric(10,2) not null default 0,
  notas text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table pedido_items (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references pedidos(id) on delete cascade,
  producto_id uuid not null references productos(id) on delete restrict,
  cantidad numeric(10,2) not null default 1,
  precio_unitario numeric(10,2) not null default 0
);

-- ============ ÍNDICES ============

create index idx_clientes_ciudad_sector on clientes(ciudad, sector);
create index idx_pedidos_fecha on pedidos(fecha);
create index idx_pedidos_estado on pedidos(estado);
create index idx_pedidos_cliente on pedidos(cliente_id);
create index idx_pedido_items_pedido on pedido_items(pedido_id);

-- ============ ROW LEVEL SECURITY ============
-- Cualquier usuario autenticado (los 3 de la familia) puede ver y editar todo.
-- Si más adelante quieren restringir por rol, se ajusta aquí.

alter table clientes enable row level security;
alter table productos enable row level security;
alter table pedidos enable row level security;
alter table pedido_items enable row level security;

create policy "usuarios_autenticados_todo_clientes" on clientes
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "usuarios_autenticados_todo_productos" on productos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "usuarios_autenticados_todo_pedidos" on pedidos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "usuarios_autenticados_todo_pedido_items" on pedido_items
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============ DATOS DE EJEMPLO (opcional, borrar si no se quiere) ============

insert into productos (nombre, unidad, precio) values
  ('Salmón', 'kg', 8000),
  ('Reineta', 'kg', 6000),
  ('Camarón', 'kg', 12000),
  ('Locos', 'unidad', 3500),
  ('Machas', 'kg', 5000);
