"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  {
    title: "Dashboard",
    href: "/admin",
  },
  {
    title: "Usuários",
    href: "/admin/usuarios",
  },
  {
    title: "Planos",
    href: "/admin/planos",
  },
  {
    title: "Configurações",
    href: "/admin/configuracao",
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === item.href ? "bg-accent" : "transparent",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
