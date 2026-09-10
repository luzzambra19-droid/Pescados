import type { Metadata } from "next";
import "./globals.css";
import { NavInferior } from "@/components/NavInferior";

export const metadata: Metadata = {
  title: "Mariscos — Pedidos y clientes",
  description: "Gestión de clientes, pedidos y repartos",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        <main className="mx-auto max-w-md px-4 pb-24 pt-6">{children}</main>
        <NavInferior />
      </body>
    </html>
  );
}
