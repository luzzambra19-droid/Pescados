import { createClient } from "@/lib/supabase/server";
import { PedidoCard } from "@/components/PedidoCard";

const LIMITE = 50;

export default async function HistorialPage() {
  const supabase = await createClient();
  const { data: pedidos } = await supabase
    .from("pedidos")
    .select(
      "id, fecha, estado, pagado, total, notas, clientes(nombre, ciudad, sector), pedido_items(cantidad, precio_unitario, productos(nombre, unidad))"
    )
    .eq("estado", "entregado")
    .order("created_at", { ascending: false })
    .limit(LIMITE);

  return (
    <div>
      <h1 className="text-xl font-semibold" style={{ color: "var(--primary)" }}>
        Historial
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
        Últimos {LIMITE} pedidos entregados.
      </p>

      {(!pedidos || pedidos.length === 0) && (
        <p className="mt-8 text-sm" style={{ color: "var(--ink-soft)" }}>
          Todavía no hay pedidos entregados.
        </p>
      )}

      <ul className="mt-6 flex flex-col gap-3">
        {(pedidos ?? []).map((p) => (
          // @ts-expect-error -- relación anidada de Supabase
          <PedidoCard key={p.id} pedido={p} />
        ))}
      </ul>
    </div>
  );
}
