import { createClient } from "@/lib/supabase/server";
import { NuevoProductoForm } from "./NuevoProductoForm";
import { ProductoRow } from "./ProductoRow";

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
          <ProductoRow key={p.id} producto={p} />
        ))}
      </ul>

      <h2 className="mt-8 text-sm font-semibold" style={{ color: "var(--ink-soft)" }}>
        Agregar producto
      </h2>
      <NuevoProductoForm />
    </div>
  );
}
