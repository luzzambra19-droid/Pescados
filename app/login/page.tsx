"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    router.push("/pedidos");
    router.refresh();
  }

  return (
    <div className="flex min-h-[80vh] flex-col justify-center">
      <h1 className="text-2xl font-semibold" style={{ color: "var(--primary)" }}>
        Iniciar sesión
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
        Clientes, pedidos y repartos en un solo lugar.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            Correo
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-[var(--radius)] border bg-surface px-3 py-2.5 outline-none focus:ring-2"
            style={{ borderColor: "var(--line)" }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-[var(--radius)] border bg-surface px-3 py-2.5 outline-none focus:ring-2"
            style={{ borderColor: "var(--line)" }}
          />
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
          {loading ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
