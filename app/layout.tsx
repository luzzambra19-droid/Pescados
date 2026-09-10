import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NavInferior } from "@/components/NavInferior";

export const metadata: Metadata = {
  title: "Mariscos — Pedidos y clientes",
  description: "Gestión de clientes, pedidos y repartos",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        <main className="mx-auto max-w-md px-4 pt-6" style={{ paddingBottom: "6.5rem" }}>
          {children}
        </main>
        <NavInferior />
      </body>
    </html>
  );
}
