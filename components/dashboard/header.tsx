"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export function DashboardHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const userName = session?.user?.name?.split(" ")[0];

  const getDescription = () => {
    switch (pathname) {
      case "/dashboard":
        return "Aqui está um resumo da sua vida financeira";
      case "/admin":
        return "Gerencie os usuários cadastrados no sistema e todas as métricas do sistema";
      case "/admin/usuarios":
        return "Gerencie os usuários cadastrados no sistema";
      case "/admin/categorias":
        return "Configure as categorias padrão do sistema";
      case "/admin/metricas":
        return "Acompanhe as métricas e desempenho do sistema";
      case "/transacoes":
        return "Visualize e gerencie todas as suas transações";
      case "/categorias":
        return "Organize suas finanças com categorias personalizadas";
      case "/admin/relatorios":
        return "Analise seus dados financeiros em detalhes";
      case "/relatorios":
        return "Analise seus dados financeiros em detalhes";
      case "/admin/usuarios":
        return "Gerencie os usuários cadastrados no sistema";

      default:
        return "Gerencie suas finanças de forma simples e eficiente";
    }
  };

  return (
    <div className="space-y-1">
      <h2 className="text-3xl font-bold tracking-tight">
        Olá, {userName || "visitante"}! 👋
      </h2>
      <p className="text-muted-foreground">{getDescription()}</p>
    </div>
  );
}
