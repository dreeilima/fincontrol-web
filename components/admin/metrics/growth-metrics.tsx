"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ComparisonIndicator from "@/components/ui/comparison-indicator";

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Crescimento de Usuários
          </CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm">Novos Usuários</p>
              <div className="flex items-center gap-2">
                <span className="font-bold">{metrics.newUsersThisMonth}</span>
                <ComparisonIndicator
                  value={metrics.comparisons.users}
                  label="vs. mês anterior"
                />
              </div>
            </div>
            <div className="text-2xl font-bold">{metrics.userGrowthRate}%</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Taxa de Conversão
          </CardTitle>
          <ArrowUpRight className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
          <ComparisonIndicator
            value={metrics.comparisons.conversion}
            label="vs. mês anterior"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Taxa de Retenção
          </CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.retentionRate}%</div>
          <ComparisonIndicator
            value={metrics.comparisons.retention}
            label="vs. mês anterior"
          />
        </CardContent>
      </Card>
    </div>
  );
}
