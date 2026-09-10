"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function ClienteFiltros({
  ciudades,
  sectores,
}: {
  ciudades: string[];
  sectores: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [valor, setValor] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (valor) {
        params.set("q", valor);
      } else {
        params.delete("q");
      }
      router.push(`/clientes?${params.toString()}`);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor]);

  function actualizarFiltro(clave: "ciudad" | "sector", valorFiltro: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (valorFiltro) {
      params.set(clave, valorFiltro);
    } else {
      params.delete(clave);
    }
    router.push(`/clientes?${params.toString()}`);
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      <input
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="Buscar por nombre, teléfono o dirección"
        className="w-full rounded-[var(--radius)] border bg-surface px-3 py-2.5 outline-none focus:ring-2"
        style={{ borderColor: "var(--line)" }}
      />
      <div className="flex gap-2">
        <select
          value={searchParams.get("ciudad") ?? ""}
          onChange={(e) => actualizarFiltro("ciudad", e.target.value)}
          className="flex-1 rounded-[var(--radius)] border bg-surface px-2 py-2 text-sm"
          style={{ borderColor: "var(--line)" }}
        >
          <option value="">Todas las ciudades</option>
          {ciudades.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={searchParams.get("sector") ?? ""}
          onChange={(e) => actualizarFiltro("sector", e.target.value)}
          className="flex-1 rounded-[var(--radius)] border bg-surface px-2 py-2 text-sm"
          style={{ borderColor: "var(--line)" }}
        >
          <option value="">Todos los sectores</option>
          {sectores.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
