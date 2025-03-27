"use client";

import { useEffect, useState } from "react";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ComparisonIndicator from "@/components/ui/comparison-indicator";

import { MetricsGridSkeleton } from "../skeletons/metrics-skeleton";

interface FinancialMetrics {
  monthlyRecurringRevenue: number;
  averageRevenuePerUser: number;
  churnRate: number;
  mrrGrowthRate: number;
  totalRevenue: number;
  volume: number;
  comparisons: {
    mrr: number;
    revenue: number;
    volume: number;
    churn: number;
  };
}

export function FinancialMetrics() {
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch("/api/admin/metrics/financial");
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
          <ComparisonIndicator
            value={metrics.comparisons.mrr}
            label="vs. mês anterior"
          />
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
          <ComparisonIndicator
            value={metrics.comparisons.revenue}
            label="vs. mês anterior"
          />
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
          <ComparisonIndicator
            value={metrics.comparisons.churn}
            label="vs. mês anterior"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Volume Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(metrics.volume)}
          </div>
          <ComparisonIndicator
            value={metrics.comparisons.volume}
            label="vs. mês anterior"
          />
        </CardContent>
      </Card>
    </div>
  );
}
