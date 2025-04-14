import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "FinControl",
  description:
    "Gerencie suas finanças com facilidade com o FinControl! Use o poder do Next.js 14, Prisma, Neon, Auth.js v5, Resend, React Email, Shadcn/ui e Stripe para construir sua próxima grande coisa.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://twitter.com/dreeilima",
    github: "https://github.com/dreeilima/fincontrol",
  },
  mailSupport: "support@fincontrol.com",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Companhia",
    items: [
      { title: "Sobre", href: "#" },
      { title: "Blog", href: "/blog" },
      { title: "Termos", href: "/terms" },
      { title: "Privacidade", href: "/privacy" },
    ],
  },
  {
    title: "Produto",
    items: [
      { title: "Segurança", href: "#" },
      { title: "Personalização", href: "#" },
      { title: "Clientes", href: "#" },
      { title: "Changelog", href: "#" },
    ],
  },
  {
    title: "Documentação",
    items: [
      { title: "Introdução", href: "#" },
      { title: "Instalação", href: "#" },
      { title: "Componentes", href: "#" },
      { title: "Blocos de Código", href: "#" },
    ],
  },
];
