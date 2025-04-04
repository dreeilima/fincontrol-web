"use client";

import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { MetricsGridSkeleton } from "../skeletons/metrics-skeleton";

interface GrowthMetrics {
  totalUsers: number;
  newUsersThisMonth: number;
  userGrowthRate: number;
  conversionRate: number;
  retentionRate: number;
  comparisons: {
    users: number;
    conversion: number;
    retention: number;
  };
}

export function GrowthMetrics() {
  const [metrics, setMetrics] = useState<GrowthMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch("/api/admin/metrics/growth");
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
    <div className="grid grid-cols-3 gap-4">
      <div>
        <p className="text-sm text-muted-foreground">Total de Usuários</p>
        <p className="mt-1 text-2xl font-medium">{metrics.totalUsers}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Novos este Mês</p>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-2xl font-medium">{metrics.newUsersThisMonth}</p>
          <span className="text-xs text-green-500">
            +{metrics.comparisons.users}%
          </span>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Taxa de Crescimento</p>
        <p className="mt-1 text-2xl font-medium">{metrics.userGrowthRate}%</p>
      </div>
    </div>
  );
}
