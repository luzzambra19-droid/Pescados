"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function NuevoProductoForm() {
  const router = useRouter();
  const supabase = createClient();
  const [nombre, setNombre] = useState("");
  const [unidad, setUnidad] = useState("kg");
  const [precio, setPrecio] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await supabase.from("productos").insert({
      nombre,
      unidad,
      precio: Number(precio) || 0,
    });

    setLoading(false);
    setNombre("");
    setPrecio("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del producto"
        required
        className="rounded-[var(--radius)] border bg-surface px-3 py-2.5 outline-none focus:ring-2"
        style={{ borderColor: "var(--line)" }}
      />
      <div className="flex gap-3">
        <select
          value={unidad}
          onChange={(e) => setUnidad(e.target.value)}
          className="rounded-[var(--radius)] border bg-surface px-3 py-2.5"
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
          placeholder="Precio"
          required
          className="flex-1 rounded-[var(--radius)] border bg-surface px-3 py-2.5 outline-none focus:ring-2"
          style={{ borderColor: "var(--line)" }}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-[var(--radius)] py-2.5 font-medium text-white disabled:opacity-60"
        style={{ background: "var(--primary)" }}
      >
        {loading ? "Guardando…" : "Agregar producto"}
      </button>
    </form>
  );
}
