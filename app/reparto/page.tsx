import { createClient } from "@/lib/supabase/server";

export default async function RepartoPage() {
  const supabase = await createClient();
  const { data: pedidos } = await supabase
    .from("pedidos")
    .select(
      "id, total, pagado, estado, clientes(nombre, ciudad, sector, direccion, telefono)"
    )
    .in("estado", ["pendiente", "en_reparto"])
    .order("created_at");

  const grupos = new Map<string, typeof pedidos>();
  for (const p of pedidos ?? []) {
    // @ts-expect-error -- relación anidada de Supabase
    const key = `${p.clientes?.ciudad} — ${p.clientes?.sector}`;
    if (!grupos.has(key)) grupos.set(key, []);
    grupos.get(key)!.push(p);
  }

  return (
    <div>
      <h1 className="text-xl font-semibold" style={{ color: "var(--primary)" }}>
        Reparto de hoy
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
        Pedidos pendientes y en reparto, agrupados por zona.
      </p>

      {grupos.size === 0 && (
        <p className="mt-8 text-sm" style={{ color: "var(--ink-soft)" }}>
          No hay pedidos pendientes de entrega.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-6">
        {Array.from(grupos.entries()).map(([zona, items]) => (
          <div key={zona}>
            <h2
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--ink-soft)" }}
            >
              {zona} · {items!.length} pedido{items!.length > 1 ? "s" : ""}
            </h2>
            <ul className="mt-2 flex flex-col gap-2">
              {items!.map((p: any) => (
                <li
                  key={p.id}
                  className="rounded-[var(--radius)] border bg-surface p-3"
                  style={{ borderColor: "var(--line)" }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{p.clientes?.nombre}</p>
                      <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                        {p.clientes?.direccion || "Sin dirección"}
                        {p.clientes?.telefono ? ` · ${p.clientes.telefono}` : ""}
                      </p>
                    </div>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        background: p.pagado ? "var(--ok-soft)" : "var(--accent-soft)",
                        color: p.pagado ? "var(--ok)" : "var(--accent)",
                      }}
                    >
                      ${p.total.toLocaleString("es-CL")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
