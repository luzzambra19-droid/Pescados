-- Migración: estados de cliente (deshabilitado / bloqueado)
-- Ejecutar en el SQL Editor de Supabase después de schema.sql

alter table clientes
  add column if not exists activo boolean not null default true,
  add column if not exists bloqueado boolean not null default false,
  add column if not exists bloqueado_motivo text;

create index if not exists idx_clientes_activo on clientes(activo);
create index if not exists idx_clientes_bloqueado on clientes(bloqueado);
