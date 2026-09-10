"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { USUARIOS } from "@/lib/usuarios";

const PIN_LARGO = 4;

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [usuario, setUsuario] = useState<(typeof USUARIOS)[number] | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function elegirUsuario(u: (typeof USUARIOS)[number]) {
    setUsuario(u);
    setPin("");
    setError(null);
  }

  function volver() {
    setUsuario(null);
    setPin("");
    setError(null);
  }

  async function ingresarDigito(d: string) {
    if (pin.length >= PIN_LARGO || loading) return;
    const nuevo = pin + d;
    setPin(nuevo);

    if (nuevo.length === PIN_LARGO && usuario) {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithPassword({
        email: usuario.email,
        password: nuevo,
      });

      setLoading(false);

      if (error) {
        setError("PIN incorrecto.");
        setPin("");
        return;
      }

      router.push("/pedidos");
      router.refresh();
    }
  }

  function borrar() {
    setError(null);
    setPin((p) => p.slice(0, -1));
  }

  if (!usuario) {
    return (
      <div className="flex min-h-[80vh] flex-col justify-center">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--primary)" }}>
          ¿Quién eres?
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
          Elige tu nombre para ingresar.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {USUARIOS.map((u) => (
            <button
              key={u.email}
              onClick={() => elegirUsuario(u)}
              className="rounded-[var(--radius)] border bg-surface py-4 text-lg font-medium"
              style={{ borderColor: "var(--line)" }}
            >
              {u.nombre}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] flex-col justify-center">
      <button
        onClick={volver}
        className="self-start text-sm font-medium"
        style={{ color: "var(--ink-soft)" }}
      >
        ← Cambiar usuario
      </button>

      <h1 className="mt-4 text-2xl font-semibold" style={{ color: "var(--primary)" }}>
        Hola, {usuario.nombre}
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
        Ingresa tu PIN de {PIN_LARGO} dígitos.
      </p>

      <div className="mt-8 flex justify-center gap-3">
        {Array.from({ length: PIN_LARGO }).map((_, i) => (
          <span
            key={i}
            className="h-4 w-4 rounded-full"
            style={{
              background: i < pin.length ? "var(--primary)" : "var(--line)",
            }}
          />
        ))}
      </div>

      {error && (
        <p className="mt-3 text-center text-sm" style={{ color: "var(--accent)" }}>
          {error}
        </p>
      )}
      {loading && (
        <p className="mt-3 text-center text-sm" style={{ color: "var(--ink-soft)" }}>
          Verificando…
        </p>
      )}

      <div className="mx-auto mt-8 grid w-full max-w-xs grid-cols-3 gap-3">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <button
            key={d}
            onClick={() => ingresarDigito(d)}
            disabled={loading}
            className="rounded-[var(--radius)] border bg-surface py-4 text-xl font-medium disabled:opacity-50"
            style={{ borderColor: "var(--line)" }}
          >
            {d}
          </button>
        ))}
        <div />
        <button
          onClick={() => ingresarDigito("0")}
          disabled={loading}
          className="rounded-[var(--radius)] border bg-surface py-4 text-xl font-medium disabled:opacity-50"
          style={{ borderColor: "var(--line)" }}
        >
          0
        </button>
        <button
          onClick={borrar}
          disabled={loading}
          className="rounded-[var(--radius)] border bg-surface py-4 text-sm font-medium disabled:opacity-50"
          style={{ borderColor: "var(--line)" }}
        >
          Borrar
        </button>
      </div>
    </div>
  );
}
