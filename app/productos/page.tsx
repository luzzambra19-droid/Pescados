import { createClient } from "@/lib/supabase/server";
import { NuevoProductoForm } from "./NuevoProductoForm";

export default async function ProductosPage() {
  const supabase = await createClient();
  const { data: productos } = await supabase
    .from("productos")
    .select("*")
    .order("nombre");

  return (
    <div>
      <h1 className="text-xl font-semibold" style={{ color: "var(--primary)" }}>
        Productos
      </h1>

      <ul className="mt-6 flex flex-col gap-2">
        {(productos ?? []).map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between rounded-[var(--radius)] border bg-surface p-3"
            style={{
              borderColor: "var(--line)",
              opacity: p.activo ? 1 : 0.5,
            }}
          >
            <span className="font-medium">{p.nombre}</span>
            <span className="tabular text-sm" style={{ color: "var(--ink-soft)" }}>
              ${p.precio.toLocaleString("es-CL")} / {p.unidad}
            </span>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 text-sm font-semibold" style={{ color: "var(--ink-soft)" }}>
        Agregar producto
      </h2>
      <NuevoProductoForm />
    </div>
  );
}
