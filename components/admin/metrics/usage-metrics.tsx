"use client";

import { useEffect, useState } from "react";
import { Activity, BarChart3, Users2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { MetricsGridSkeleton } from "../skeletons/metrics-skeleton";

interface UsageMetrics {
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  averageTransactionsPerUser: number;
  topCategories: Array<{
    name: string;
    count: number;
  }>;
  systemUsage: {
    totalTransactions: number;
    totalCategories: number;
    avgTransactionsPerDay: number;
  };
}

export function UsageMetrics() {
  const [metrics, setMetrics] = useState<UsageMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch("/api/admin/metrics/usage");
        if (!response.ok) throw new Error("Falha ao carregar métricas");
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  if (loading || !metrics) return <MetricsGridSkeleton />;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
          <Users2 className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.dailyActiveUsers}</div>
          <p className="text-xs text-muted-foreground">
            {metrics.monthlyActiveUsers} ativos este mês
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Média de Transações
          </CardTitle>
          <Activity className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.averageTransactionsPerUser}
          </div>
          <p className="text-xs text-muted-foreground">Por usuário/mês</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Uso do Sistema</CardTitle>
          <BarChart3 className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.systemUsage.avgTransactionsPerDay}
          </div>
          <p className="text-xs text-muted-foreground">Transações por dia</p>
        </CardContent>
      </Card>
    </div>
  );
}
