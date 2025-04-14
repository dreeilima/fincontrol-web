"use client";

import { useEffect, useState } from "react";
import { Activity, BarChart3, Users2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ComparisonIndicator from "@/components/ui/comparison-indicator";

import { MetricsGridSkeleton } from "../skeletons/metrics-skeleton";

interface UsageMetrics {
  monthlyActiveUsers: number;
  systemUsage: {
    totalTransactions: number;
    totalCategories: number;
  };
  comparisons: {
    monthlyUsers: number;
    transactions: number;
  };
}

export function UsageMetrics() {
  const [metrics, setMetrics] = useState<UsageMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch("/api/admin/metrics/usage");
        if (!response.ok) throw new Error();
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
    <Card>
      <CardHeader>
        <CardTitle>Métricas do Sistema</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Total de Usuários
              </p>
              <p className="text-sm text-muted-foreground">
                Usuários cadastrados
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users2 className="size-4 text-muted-foreground" />
                <span className="font-bold">{metrics.monthlyActiveUsers}</span>
              </div>
              <ComparisonIndicator
                value={metrics.comparisons.monthlyUsers}
                label="vs. mês anterior"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Total de Transações
              </p>
              <p className="text-sm text-muted-foreground">
                Transações registradas
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-muted-foreground" />
                <span className="font-bold">
                  {metrics.systemUsage.totalTransactions}
                </span>
              </div>
              <ComparisonIndicator
                value={metrics.comparisons.transactions}
                label="vs. mês anterior"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Total de Categorias
              </p>
              <p className="text-sm text-muted-foreground">
                Categorias cadastradas
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="size-4 text-muted-foreground" />
                <span className="font-bold">
                  {metrics.systemUsage.totalCategories}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
