"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/pedidos", label: "Pedidos" },
  { href: "/reparto", label: "Reparto" },
  { href: "/historial", label: "Historial" },
  { href: "/clientes", label: "Clientes" },
  { href: "/productos", label: "Productos" },
];

export function NavInferior() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t bg-surface"
      style={{
        borderColor: "var(--line)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 22px)",
      }}
    >
      <ul className="mx-auto flex max-w-md">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className="flex flex-col items-center gap-1 px-1 pt-2.5 pb-1 text-center text-[11px] leading-tight"
                style={{
                  color: active ? "var(--primary)" : "var(--ink-soft)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
