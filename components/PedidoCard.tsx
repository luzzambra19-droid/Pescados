"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ESTADOS = [
  { value: "pendiente", label: "Pendiente" },
  { value: "en_reparto", label: "En reparto" },
  { value: "entregado", label: "Entregado" },
] as const;

const ESTADO_COLOR: Record<string, string> = {
  pendiente: "var(--accent)",
  en_reparto: "var(--primary)",
  entregado: "var(--ok)",
};

const UNIDAD_ABREV: Record<string, string> = {
  kg: "k",
  unidad: " un.",
  caja: " cja.",
  bandeja: " band.",
};

function formatCantidad(cantidad: number, unidad?: string) {
  return `${cantidad}${UNIDAD_ABREV[unidad ?? ""] ?? ` ${unidad ?? ""}`}`;
}

type ItemPedido = {
  cantidad: number;
  precio_unitario: number;
  productos: { nombre: string; unidad: string } | null;
};

export function PedidoCard({
  pedido,
}: {
  pedido: {
    id: string;
    fecha: string;
    estado: string;
    pagado: boolean;
    total: number;
    notas: string | null;
    clientes: { nombre: string; ciudad: string; sector: string } | null;
    pedido_items: ItemPedido[] | null;
  };
}) {
  const router = useRouter();
  const supabase = createClient();
  const [estado, setEstado] = useState(pedido.estado);
  const [pagado, setPagado] = useState(pedido.pagado);

  async function actualizarEstado(nuevo: string) {
    setEstado(nuevo);
    await supabase.from("pedidos").update({ estado: nuevo }).eq("id", pedido.id);
    router.refresh();
  }

  async function actualizarPagado() {
    const nuevo = !pagado;
    setPagado(nuevo);
    await supabase.from("pedidos").update({ pagado: nuevo }).eq("id", pedido.id);
    router.refresh();
  }

  const items = pedido.pedido_items ?? [];
  const unItem = items.length === 1 ? items[0] : null;

  return (
    <li
      className="rounded-[var(--radius)] border bg-surface p-3"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium">{pedido.clientes?.nombre ?? "Cliente eliminado"}</p>
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            {pedido.clientes?.ciudad} — {pedido.clientes?.sector}
          </p>
        </div>

        {unItem && (
          <div className="shrink-0 text-right">
            <p className="tabular text-lg font-semibold" style={{ color: "var(--primary)" }}>
              {formatCantidad(unItem.cantidad, unItem.productos?.unidad)}
            </p>
            <p className="tabular text-xs" style={{ color: "var(--ink-soft)" }}>
              ${pedido.total.toLocaleString("es-CL")}
            </p>
          </div>
        )}
      </div>

      {unItem ? (
        <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
          {unItem.productos?.nombre}
        </p>
      ) : (
        <div className="mt-2 flex flex-col gap-1 border-t pt-2" style={{ borderColor: "var(--line)" }}>
          {items.map((it, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span>{it.productos?.nombre}</span>
              <span className="tabular" style={{ color: "var(--ink-soft)" }}>
                {formatCantidad(it.cantidad, it.productos?.unidad)} · $
                {it.precio_unitario.toLocaleString("es-CL")}
              </span>
            </div>
          ))}
          <div className="mt-1 flex items-center justify-between text-sm font-medium">
            <span>Total</span>
            <span className="tabular">${pedido.total.toLocaleString("es-CL")}</span>
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <select
          value={estado}
          onChange={(e) => actualizarEstado(e.target.value)}
          className="rounded-full border px-2.5 py-1 text-xs font-medium"
          style={{ borderColor: "var(--line)", color: ESTADO_COLOR[estado] }}
        >
          {ESTADOS.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>

        <button
          onClick={actualizarPagado}
          className="rounded-full px-2.5 py-1 text-xs font-medium"
          style={{
            background: pagado ? "var(--ok-soft)" : "var(--accent-soft)",
            color: pagado ? "var(--ok)" : "var(--accent)",
          }}
        >
          {pagado ? "Pagado" : "Debe"}
        </button>
      </div>
    </li>
  );
}
