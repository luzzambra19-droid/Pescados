"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Cliente = {
  id: string;
  nombre: string;
  ciudad: string;
  sector: string;
  bloqueado: boolean;
  bloqueado_motivo: string | null;
};
type Producto = { id: string; nombre: string; unidad: string; precio: number };
type Item = { producto_id: string; cantidad: number };

export default function NuevoPedidoPage() {
  const router = useRouter();
  const supabase = createClient();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [items, setItems] = useState<Item[]>([{ producto_id: "", cantidad: 1 }]);
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: c }, { data: p }] = await Promise.all([
        supabase
          .from("clientes")
          .select("id, nombre, ciudad, sector, bloqueado, bloqueado_motivo")
          .eq("activo", true)
          .order("nombre"),
        supabase.from("productos").select("id, nombre, unidad, precio").eq("activo", true).order("nombre"),
      ]);
      setClientes(c ?? []);
      setProductos(p ?? []);
    })();
  }, []);

  const clienteSeleccionado = clientes.find((c) => c.id === clienteId);

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      const prod = productos.find((p) => p.id === item.producto_id);
      return sum + (prod ? prod.precio * item.cantidad : 0);
    }, 0);
  }, [items, productos]);

  function actualizarItem(idx: number, cambios: Partial<Item>) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...cambios } : it)));
  }

  function agregarItem() {
    setItems((prev) => [...prev, { producto_id: "", cantidad: 1 }]);
  }

  function quitarItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const itemsValidos = items.filter((it) => it.producto_id && it.cantidad > 0);
    if (!clienteId || itemsValidos.length === 0) {
      setError("Elige un cliente y al menos un producto.");
      return;
    }

    setLoading(true);

    const { data: pedido, error: errPedido } = await supabase
      .from("pedidos")
      .insert({ cliente_id: clienteId, total, notas: notas || null })
      .select("id")
      .single();

    if (errPedido || !pedido) {
      setLoading(false);
      setError("No se pudo crear el pedido.");
      return;
    }

    const filas = itemsValidos.map((it) => {
      const prod = productos.find((p) => p.id === it.producto_id)!;
      return {
        pedido_id: pedido.id,
        producto_id: it.producto_id,
        cantidad: it.cantidad,
        precio_unitario: prod.precio,
      };
    });

    const { error: errItems } = await supabase.from("pedido_items").insert(filas);

    setLoading(false);

    if (errItems) {
      setError("El pedido se creó pero hubo un problema guardando los productos.");
      return;
    }

    router.push("/pedidos");
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-xl font-semibold" style={{ color: "var(--primary)" }}>
        Nuevo pedido
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Cliente</label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            required
            className="rounded-[var(--radius)] border bg-surface px-3 py-2.5"
            style={{ borderColor: "var(--line)" }}
          >
            <option value="">Selecciona un cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} — {c.ciudad}/{c.sector}
              </option>
            ))}
          </select>
          {clienteSeleccionado?.bloqueado && (
            <p
              className="rounded-[var(--radius)] px-3 py-2 text-sm font-medium"
              style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
            >
              ⚠ Cliente bloqueado
              {clienteSeleccionado.bloqueado_motivo
                ? `: ${clienteSeleccionado.bloqueado_motivo}`
                : ""}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">Productos</label>
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <select
                value={item.producto_id}
                onChange={(e) => actualizarItem(idx, { producto_id: e.target.value })}
                className="flex-1 rounded-[var(--radius)] border bg-surface px-3 py-2.5"
                style={{ borderColor: "var(--line)" }}
              >
                <option value="">Producto</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} (${p.precio.toLocaleString("es-CL")}/{p.unidad})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={0}
                step="0.1"
                value={item.cantidad}
                onChange={(e) => actualizarItem(idx, { cantidad: Number(e.target.value) })}
                className="w-20 rounded-[var(--radius)] border bg-surface px-2 py-2.5 text-center"
                style={{ borderColor: "var(--line)" }}
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => quitarItem(idx)}
                  className="px-2 text-sm"
                  style={{ color: "var(--accent)" }}
                >
                  Quitar
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={agregarItem}
            className="self-start text-sm font-medium"
            style={{ color: "var(--primary)" }}
          >
            + Agregar producto
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Notas</label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={2}
            placeholder="Opcional"
            className="rounded-[var(--radius)] border bg-surface px-3 py-2.5 outline-none focus:ring-2"
            style={{ borderColor: "var(--line)" }}
          />
        </div>

        <div
          className="flex items-center justify-between rounded-[var(--radius)] p-3"
          style={{ background: "var(--primary-soft)" }}
        >
          <span className="text-sm font-medium">Total</span>
          <span className="tabular text-lg font-semibold" style={{ color: "var(--primary)" }}>
            ${total.toLocaleString("es-CL")}
          </span>
        </div>

        {error && (
          <p className="text-sm" style={{ color: "var(--accent)" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-[var(--radius)] py-3 font-medium text-white disabled:opacity-60"
          style={{ background: "var(--primary)" }}
        >
          {loading ? "Guardando…" : "Guardar pedido"}
        </button>
      </form>
    </div>
  );
}
