"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NuevoClientePage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    ciudad: "",
    sector: "",
    direccion: "",
    notas: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.from("clientes").insert({
      nombre: form.nombre,
      telefono: form.telefono || null,
      ciudad: form.ciudad,
      sector: form.sector,
      direccion: form.direccion || null,
      notas: form.notas || null,
    });

    setLoading(false);

    if (error) {
      setError("No se pudo guardar el cliente. Intenta de nuevo.");
      return;
    }

    router.push("/clientes");
    router.refresh();
  }

  const campo = (
    label: string,
    key: keyof typeof form,
    opts: { required?: boolean; placeholder?: string } = {}
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        required={opts.required}
        placeholder={opts.placeholder}
        className="rounded-[var(--radius)] border bg-surface px-3 py-2.5 outline-none focus:ring-2"
        style={{ borderColor: "var(--line)" }}
      />
    </div>
  );

  return (
    <div>
      <h1 className="text-xl font-semibold" style={{ color: "var(--primary)" }}>
        Nuevo cliente
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {campo("Nombre", "nombre", { required: true })}
        {campo("Teléfono", "telefono", { placeholder: "+56 9…" })}
        {campo("Ciudad", "ciudad", { required: true })}
        {campo("Sector", "sector", { required: true })}
        {campo("Dirección", "direccion")}
        {campo("Notas", "notas", { placeholder: "Opcional" })}

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
          {loading ? "Guardando…" : "Guardar cliente"}
        </button>
      </form>
    </div>
  );
}
