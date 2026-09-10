import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ ver?: string }>;
}) {
  const { ver } = await searchParams;
  const verInactivos = ver === "inactivos";

  const supabase = await createClient();
  const { data: clientes } = await supabase
    .from("clientes")
    .select("*")
    .eq("activo", !verInactivos)
    .order("ciudad")
    .order("sector")
    .order("nombre");

  const grupos = new Map<string, typeof clientes>();
  for (const c of clientes ?? []) {
    const key = `${c.ciudad} — ${c.sector}`;
    if (!grupos.has(key)) grupos.set(key, []);
    grupos.get(key)!.push(c);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold" style={{ color: "var(--primary)" }}>
          Clientes
        </h1>
        <Link
          href="/clientes/nuevo"
          className="rounded-[var(--radius)] px-3 py-2 text-sm font-medium text-white"
          style={{ background: "var(--primary)" }}
        >
          + Nuevo
        </Link>
      </div>

      <div className="mt-3 flex gap-2 text-sm">
        <Link
          href="/clientes"
          className="rounded-full px-3 py-1 font-medium"
          style={{
            background: !verInactivos ? "var(--primary-soft)" : "transparent",
            color: !verInactivos ? "var(--primary)" : "var(--ink-soft)",
          }}
        >
          Activos
        </Link>
        <Link
          href="/clientes?ver=inactivos"
          className="rounded-full px-3 py-1 font-medium"
          style={{
            background: verInactivos ? "var(--primary-soft)" : "transparent",
            color: verInactivos ? "var(--primary)" : "var(--ink-soft)",
          }}
        >
          Inactivos
        </Link>
      </div>

      {grupos.size === 0 && (
        <p className="mt-8 text-sm" style={{ color: "var(--ink-soft)" }}>
          {verInactivos
            ? "No hay clientes inactivos."
            : "Todavía no hay clientes registrados."}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-6">
        {Array.from(grupos.entries()).map(([grupo, items]) => (
          <div key={grupo}>
            <h2
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--ink-soft)" }}
            >
              {grupo}
            </h2>
            <ul className="mt-2 flex flex-col gap-2">
              {items!.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/clientes/${c.id}`}
                    className="block rounded-[var(--radius)] border bg-surface p-3"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{c.nombre}</p>
                        <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                          {c.telefono || "Sin teléfono"}
                          {c.direccion ? ` · ${c.direccion}` : ""}
                        </p>
                      </div>
                      {c.bloqueado && (
                        <span
                          className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                        >
                          Bloqueado
                        </span>
                      )}
                    </div>
                    {c.bloqueado && c.bloqueado_motivo && (
                      <p className="mt-1 text-xs" style={{ color: "var(--accent)" }}>
                        {c.bloqueado_motivo}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
