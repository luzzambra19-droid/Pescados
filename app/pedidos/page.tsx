import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PedidoCard } from "@/components/PedidoCard";

export default async function PedidosPage() {
  const supabase = await createClient();
  const { data: pedidos } = await supabase
    .from("pedidos")
    .select(
      "id, fecha, estado, pagado, total, notas, clientes(nombre, ciudad, sector), pedido_items(cantidad, precio_unitario, productos(nombre, unidad))"
    )
    .order("fecha", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold" style={{ color: "var(--primary)" }}>
          Pedidos
        </h1>
        <Link
          href="/pedidos/nuevo"
          className="rounded-[var(--radius)] px-3 py-2 text-sm font-medium text-white"
          style={{ background: "var(--primary)" }}
        >
          + Nuevo
        </Link>
      </div>

      {(!pedidos || pedidos.length === 0) && (
        <p className="mt-8 text-sm" style={{ color: "var(--ink-soft)" }}>
          Todavía no hay pedidos registrados.
        </p>
      )}

      <ul className="mt-6 flex flex-col gap-3">
        {(pedidos ?? []).map((p) => (
          // @ts-expect-error -- el tipo de la relación clientes viene anidado desde Supabase
          <PedidoCard key={p.id} pedido={p} />
        ))}
      </ul>
    </div>
  );
}
