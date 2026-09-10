"use client";

import * as XLSX from "xlsx";

type ItemPedido = {
  cantidad: number;
  productos: { nombre: string; unidad: string } | null;
};

type PedidoReparto = {
  id: string;
  total: number;
  pagado: boolean;
  estado: string;
  clientes: {
    nombre: string;
    ciudad: string;
    sector: string;
    direccion: string | null;
    telefono: string | null;
  } | null;
  pedido_items: ItemPedido[] | null;
};

const ESTADO_LABEL: Record<string, string> = {
  pendiente: "Pendiente",
  en_reparto: "En reparto",
  entregado: "Entregado",
};

function formatearProductos(items: ItemPedido[] | null) {
  return (items ?? [])
    .map((it) => {
      const nombre = it.productos?.nombre ?? "Producto";
      const unidad = it.productos?.unidad ?? "";
      return `${nombre} (${it.cantidad}${unidad === "kg" ? "k" : ` ${unidad}`})`;
    })
    .join(", ");
}

export function ExportarRepartoButton({ pedidos }: { pedidos: PedidoReparto[] }) {
  function exportar() {
    const filas = pedidos.map((p) => ({
      Ciudad: p.clientes?.ciudad ?? "",
      Sector: p.clientes?.sector ?? "",
      Cliente: p.clientes?.nombre ?? "",
      Teléfono: p.clientes?.telefono ?? "",
      Dirección: p.clientes?.direccion ?? "",
      Productos: formatearProductos(p.pedido_items),
      Total: p.total,
      Pagado: p.pagado ? "Sí" : "No",
      Estado: ESTADO_LABEL[p.estado] ?? p.estado,
    }));

    const hoja = XLSX.utils.json_to_sheet(filas);
    hoja["!cols"] = [
      { wch: 14 },
      { wch: 16 },
      { wch: 22 },
      { wch: 13 },
      { wch: 30 },
      { wch: 36 },
      { wch: 10 },
      { wch: 8 },
      { wch: 12 },
    ];

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Reparto");

    const fecha = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(libro, `reparto_${fecha}.xlsx`);
  }

  return (
    <button
      onClick={exportar}
      className="shrink-0 rounded-[var(--radius)] border px-3 py-2 text-sm font-medium"
      style={{ borderColor: "var(--line)" }}
    >
      Exportar Excel
    </button>
  );
}
