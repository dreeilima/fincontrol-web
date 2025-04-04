"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

interface DashboardHeaderProps {
  heading?: string;
  description?: string;
}

export function DashboardHeader({
  heading,
  description,
}: DashboardHeaderProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const userName = session?.user?.name?.split(" ")[0];

  function getGreeting() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Bom dia";
    }
    if (hour >= 12 && hour < 18) {
      return "Boa tarde";
    }
    return "Boa noite";
  }

  function getDefaultDescription() {
    switch (pathname) {
      case "/dashboard":
        return "Aqui está um resumo das suas finanças";
      case "/dashboard/financas":
        return "Gerencie tudo sobre suas finanças";
      case "/dashboard/relatorio":
        return "Veja tudo sobre suas finanças";
      case "/dashboard/assinatura":
        return "Gerencie sua assinatura";
      case "/dashboard/configuracao":
        return "Gerencie suas configurações";
      default:
        return "Bem-vindo ao Fincontrol";
    }
  }

  return (
    <div className="space-y-1">
      <h2 className="text-3xl font-bold tracking-tight">
        {status === "loading" ? (
          <span className="block h-9 w-48 animate-pulse rounded-md bg-muted" />
        ) : (
          <>
            {heading || (
              <>
                {getGreeting()}, {userName || "visitante"}! 👋
              </>
            )}
          </>
        )}
      </h2>
      <p className="text-muted-foreground">
        {status === "loading" ? (
          <span className="block h-5 w-96 animate-pulse rounded-md bg-muted" />
        ) : (
          description || getDefaultDescription()
        )}
      </p>
    </div>
  );
}
