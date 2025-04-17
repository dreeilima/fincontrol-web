import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      {
        href: "/admin",
        icon: "laptop",
        title: "Administração",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/usuarios",
        icon: "users",
        title: "Usuários",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/planos",
        icon: "billing",
        title: "Planos e Assinaturas",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/dashboard",
        icon: "dashboard",
        title: "Dashboard",
        authorizeOnly: UserRole.USER, // Usando o enum do Prisma
      },
      {
        href: "/dashboard/financas",
        icon: "financas",
        title: "Finanças",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/dashboard/relatorio",
        icon: "lineChart",
        title: "Relatórios",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/admin/relatorios",
        icon: "lineChart",
        title: "Relatórios",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/dashboard/assinatura", // Este caminho está correto
        icon: "billing",
        title: "Assinatura",
        authorizeOnly: UserRole.USER,
      },
    ],
  },
  {
    title: "OPÇÕES",
    items: [
      {
        href: "/dashboard/configuracao", // Este caminho está correto
        icon: "settings",
        title: "Configurações",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/admin/configuracao",
        icon: "settings",
        title: "Configurações do Sistema",
        authorizeOnly: UserRole.ADMIN,
      },
    ],
  },
];
