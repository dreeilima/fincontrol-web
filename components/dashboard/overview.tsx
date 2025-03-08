"use client";

import { AlertCircleIcon, TrendingUpIcon, WalletIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Saldo Atual</CardTitle>
          <WalletIcon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ 4.200,00</div>
          <p className="text-xs text-muted-foreground">
            Atualizado em {new Date().toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Próximas Receitas</CardTitle>
          <TrendingUpIcon className="size-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">R$ 3.500,00</div>
          <p className="text-xs text-muted-foreground">
            Previsto para os próximos 7 dias
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contas Próximas</CardTitle>
          <AlertCircleIcon className="size-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-500">R$ 850,00</div>
          <p className="text-xs text-muted-foreground">
            3 contas vencem esta semana
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
