"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Producto = {
  id: string;
  nombre: string;
  unidad: string;
  precio: number;
  activo: boolean;
};

export function ProductoRow({ producto }: { producto: Producto }) {
  const router = useRouter();
  const supabase = createClient();
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(producto.nombre);
  const [unidad, setUnidad] = useState(producto.unidad);
  const [precio, setPrecio] = useState(String(producto.precio));
  const [loading, setLoading] = useState(false);

  async function guardar() {
    setLoading(true);
    await supabase
      .from("productos")
      .update({ nombre, unidad, precio: Number(precio) || 0 })
      .eq("id", producto.id);
    setLoading(false);
    setEditando(false);
    router.refresh();
  }

  async function toggleActivo() {
    setLoading(true);
    await supabase
      .from("productos")
      .update({ activo: !producto.activo })
      .eq("id", producto.id);
    setLoading(false);
    router.refresh();
  }

  if (editando) {
    return (
      <li
        className="flex flex-col gap-2 rounded-[var(--radius)] border bg-surface p-3"
        style={{ borderColor: "var(--line)" }}
      >
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="rounded-[var(--radius)] border bg-surface px-3 py-2 outline-none focus:ring-2"
          style={{ borderColor: "var(--line)" }}
        />
        <div className="flex gap-2">
          <select
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
            className="rounded-[var(--radius)] border bg-surface px-3 py-2"
            style={{ borderColor: "var(--line)" }}
          >
            <option value="kg">kg</option>
            <option value="unidad">unidad</option>
            <option value="caja">caja</option>
            <option value="bandeja">bandeja</option>
          </select>
          <input
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            type="number"
            className="flex-1 rounded-[var(--radius)] border bg-surface px-3 py-2 outline-none focus:ring-2"
            style={{ borderColor: "var(--line)" }}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={guardar}
            disabled={loading}
            className="flex-1 rounded-[var(--radius)] py-2 text-sm font-medium text-white disabled:opacity-60"
            style={{ background: "var(--primary)" }}
          >
            {loading ? "Guardando…" : "Guardar"}
          </button>
          <button
            onClick={() => {
              setNombre(producto.nombre);
              setUnidad(producto.unidad);
              setPrecio(String(producto.precio));
              setEditando(false);
            }}
            className="rounded-[var(--radius)] border px-4 py-2 text-sm font-medium"
            style={{ borderColor: "var(--line)" }}
          >
            Cancelar
          </button>
        </div>
      </li>
    );
  }

  return (
    <li
      className="flex items-center justify-between gap-2 rounded-[var(--radius)] border bg-surface p-3"
      style={{ borderColor: "var(--line)", opacity: producto.activo ? 1 : 0.5 }}
    >
      <div className="min-w-0">
        <p className="truncate font-medium">{producto.nombre}</p>
        <p className="tabular text-sm" style={{ color: "var(--ink-soft)" }}>
          ${producto.precio.toLocaleString("es-CL")} / {producto.unidad}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => setEditando(true)}
          className="rounded-[var(--radius)] border px-3 py-1.5 text-xs font-medium"
          style={{ borderColor: "var(--line)" }}
        >
          Editar
        </button>
        <button
          onClick={toggleActivo}
          disabled={loading}
          className="rounded-[var(--radius)] px-3 py-1.5 text-xs font-medium disabled:opacity-60"
          style={{
            background: producto.activo ? "var(--accent-soft)" : "var(--ok-soft)",
            color: producto.activo ? "var(--accent)" : "var(--ok)",
          }}
        >
          {producto.activo ? "Desactivar" : "Activar"}
        </button>
      </div>
    </li>
  );
}
