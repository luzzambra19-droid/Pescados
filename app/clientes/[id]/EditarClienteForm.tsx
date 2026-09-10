"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Cliente = {
  id: string;
  nombre: string;
  telefono: string | null;
  ciudad: string;
  sector: string;
  direccion: string | null;
  notas: string | null;
  activo: boolean;
  bloqueado: boolean;
  bloqueado_motivo: string | null;
};

export function EditarClienteForm({ cliente }: { cliente: Cliente }) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    nombre: cliente.nombre,
    telefono: cliente.telefono ?? "",
    ciudad: cliente.ciudad,
    sector: cliente.sector,
    direccion: cliente.direccion ?? "",
    notas: cliente.notas ?? "",
  });
  const [activo, setActivo] = useState(cliente.activo);
  const [bloqueado, setBloqueado] = useState(cliente.bloqueado);
  const [motivo, setMotivo] = useState(cliente.bloqueado_motivo ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase
      .from("clientes")
      .update({
        nombre: form.nombre,
        telefono: form.telefono || null,
        ciudad: form.ciudad,
        sector: form.sector,
        direccion: form.direccion || null,
        notas: form.notas || null,
        activo,
        bloqueado,
        bloqueado_motivo: bloqueado ? motivo || null : null,
      })
      .eq("id", cliente.id);

    setLoading(false);

    if (error) {
      setError("No se pudieron guardar los cambios.");
      return;
    }

    router.push("/clientes");
    router.refresh();
  }

  const campo = (
    label: string,
    key: keyof typeof form,
    opts: { required?: boolean } = {}
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        required={opts.required}
        className="rounded-[var(--radius)] border bg-surface px-3 py-2.5 outline-none focus:ring-2"
        style={{ borderColor: "var(--line)" }}
      />
    </div>
  );

  return (
    <div>
      <h1 className="text-xl font-semibold" style={{ color: "var(--primary)" }}>
        Editar cliente
      </h1>

      <form onSubmit={guardar} className="mt-6 flex flex-col gap-4">
        {campo("Nombre", "nombre", { required: true })}
        {campo("Teléfono", "telefono")}
        {campo("Ciudad", "ciudad", { required: true })}
        {campo("Sector", "sector", { required: true })}
        {campo("Dirección", "direccion")}
        {campo("Notas", "notas")}

        <div
          className="mt-2 flex flex-col gap-3 rounded-[var(--radius)] border p-3"
          style={{ borderColor: "var(--line)" }}
        >
          <label className="flex items-center justify-between">
            <span>
              <span className="font-medium">Cliente activo</span>
              <br />
              <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
                Si lo desactivas, deja de aparecer en la lista y en el selector de
                pedidos. Puedes reactivarlo cuando quieras.
              </span>
            </span>
            <input
              type="checkbox"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="h-5 w-5 shrink-0"
            />
          </label>
        </div>

        <div
          className="flex flex-col gap-3 rounded-[var(--radius)] border p-3"
          style={{ borderColor: "var(--line)" }}
        >
          <label className="flex items-center justify-between">
            <span>
              <span className="font-medium">Cliente bloqueado</span>
              <br />
              <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
                Sigue visible en la lista con una advertencia (ej. no pago), para
                que no se te olvide.
              </span>
            </span>
            <input
              type="checkbox"
              checked={bloqueado}
              onChange={(e) => setBloqueado(e.target.checked)}
              className="h-5 w-5 shrink-0"
            />
          </label>

          {bloqueado && (
            <input
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Motivo (ej. debe 3 pedidos)"
              className="rounded-[var(--radius)] border bg-surface px-3 py-2.5 outline-none focus:ring-2"
              style={{ borderColor: "var(--line)" }}
            />
          )}
        </div>

        {error && (
          <p className="text-sm" style={{ color: "var(--accent)" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-[var(--radius)] py-3 font-medium text-white disabled:opacity-60"
          style={{ background: "var(--primary)" }}
        >
          {loading ? "Guardando…" : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
