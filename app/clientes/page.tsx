import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ClienteFiltros } from "./ClienteFiltros";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ ver?: string; q?: string; ciudad?: string; sector?: string }>;
}) {
  const { ver, q, ciudad, sector } = await searchParams;
  const verInactivos = ver === "inactivos";

  const supabase = await createClient();

  const [{ data: todos }, listaBase] = await Promise.all([
    supabase.from("clientes").select("ciudad, sector"),
    (async () => {
      let query = supabase
        .from("clientes")
        .select("*")
        .eq("activo", !verInactivos)
        .order("ciudad")
        .order("sector")
        .order("nombre");

      if (q && q.trim()) {
        const term = q.trim();
        query = query.or(
          `nombre.ilike.%${term}%,direccion.ilike.%${term}%,telefono.ilike.%${term}%,sector.ilike.%${term}%`
        );
      }
      if (ciudad) query = query.eq("ciudad", ciudad);
      if (sector) query = query.eq("sector", sector);

      return query;
    })(),
  ]);

  const clientes = listaBase.data;

  const ciudades = Array.from(
    new Set((todos ?? []).map((c) => c.ciudad).filter((v): v is string => !!v))
  ).sort();
  const sectores = Array.from(
    new Set((todos ?? []).map((c) => c.sector).filter((v): v is string => !!v))
  ).sort();

  const grupos = new Map<string, typeof clientes>();
  for (const c of clientes ?? []) {
    const key = `${c.ciudad} — ${c.sector}`;
    if (!grupos.has(key)) grupos.set(key, []);
    grupos.get(key)!.push(c);
  }

  const paramsExtra = new URLSearchParams();
  if (q) paramsExtra.set("q", q);
  if (ciudad) paramsExtra.set("ciudad", ciudad);
  if (sector) paramsExtra.set("sector", sector);
  const extra = paramsExtra.toString();

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

      <ClienteFiltros ciudades={ciudades} sectores={sectores} />

      <div className="mt-3 flex gap-2 text-sm">
        <Link
          href={`/clientes${extra ? `?${extra}` : ""}`}
          className="rounded-full px-3 py-1 font-medium"
          style={{
            background: !verInactivos ? "var(--primary-soft)" : "transparent",
            color: !verInactivos ? "var(--primary)" : "var(--ink-soft)",
          }}
        >
          Activos
        </Link>
        <Link
          href={`/clientes?${extra ? `${extra}&` : ""}ver=inactivos`}
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
          {q || ciudad || sector
            ? "No hay clientes que coincidan con el filtro."
            : verInactivos
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
