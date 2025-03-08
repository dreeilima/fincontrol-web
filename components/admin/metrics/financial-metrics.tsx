"use client";

import { useEffect, useState } from "react";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { MetricsGridSkeleton } from "../skeletons/metrics-skeleton";

interface FinancialMetrics {
  monthlyRecurringRevenue: number;
  averageRevenuePerUser: number;
  churnRate: number;
  mrrGrowthRate: number;
  totalRevenue: number;
}

export function FinancialMetrics() {
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch("/api/admin/metrics/financial");
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
          <CardTitle className="text-sm font-medium">
            Receita Mensal (MRR)
          </CardTitle>
          <DollarSign className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(metrics.monthlyRecurringRevenue)}
          </div>
          <p className="text-xs text-muted-foreground">
            {metrics.mrrGrowthRate > 0 ? "+" : ""}
            {metrics.mrrGrowthRate}% em relação ao mês anterior
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Receita por Usuário
          </CardTitle>
          <TrendingUp className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(metrics.averageRevenuePerUser)}
          </div>
          <p className="text-xs text-muted-foreground">
            Média mensal por usuário
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Taxa de Cancelamento
          </CardTitle>
          <TrendingDown className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.churnRate}%</div>
          <p className="text-xs text-muted-foreground">Cancelamentos mensais</p>
        </CardContent>
      </Card>
    </div>
  );
}
