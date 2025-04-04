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
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-muted-foreground">Receita Mensal (MRR)</p>
        <p className="mt-1 text-2xl font-medium">
          {formatCurrency(metrics.monthlyRecurringRevenue)}
        </p>
        <span className="text-xs text-green-500">
          +{metrics.comparisons.mrr}%
        </span>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Volume Total</p>
        <p className="mt-1 text-2xl font-medium">
          {formatCurrency(metrics.volume)}
        </p>
        <span className="text-xs text-green-500">
          +{metrics.comparisons.volume}%
        </span>
      </div>
    </div>
  );
}
