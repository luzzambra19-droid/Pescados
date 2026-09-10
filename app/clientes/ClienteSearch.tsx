"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function ClienteSearch() {
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

  return (
    <input
      value={valor}
      onChange={(e) => setValor(e.target.value)}
      placeholder="Buscar por nombre, teléfono o dirección"
      className="mt-3 w-full rounded-[var(--radius)] border bg-surface px-3 py-2.5 outline-none focus:ring-2"
      style={{ borderColor: "var(--line)" }}
    />
  );
}
