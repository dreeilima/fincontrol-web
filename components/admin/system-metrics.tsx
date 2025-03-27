"use client";

import { useEffect, useState } from "react";
import { FolderTree, Receipt, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { MetricsGridSkeleton } from "./skeletons/metrics-skeleton";

interface SystemMetricsData {
  totalUsers: number;
  totalTransactions: number;
  totalCategories: number;
  comparisons: {
    users: number;
    transactions: number;
    categories: number;
  };
}

export function SystemMetrics() {
  const [metrics, setMetrics] = useState<SystemMetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch("/api/admin/system-metrics");
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
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Usuários
          </CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalUsers}</div>
          <p
            className={cn(
              "mt-2 text-xs",
              metrics.comparisons.users > 0
                ? "text-green-500"
                : metrics.comparisons.users < 0
                  ? "text-red-500"
                  : "text-muted-foreground",
            )}
          >
            {metrics.comparisons.users > 0 ? "+" : ""}
            {metrics.comparisons.users}% em relação ao mês anterior
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Transações
          </CardTitle>
          <Receipt className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalTransactions}</div>
          <p
            className={cn(
              "mt-2 text-xs",
              metrics.comparisons.transactions > 0
                ? "text-green-500"
                : metrics.comparisons.transactions < 0
                  ? "text-red-500"
                  : "text-muted-foreground",
            )}
          >
            {metrics.comparisons.transactions > 0 ? "+" : ""}
            {metrics.comparisons.transactions}% em relação ao mês anterior
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Categorias
          </CardTitle>
          <FolderTree className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalCategories}</div>
          <p
            className={cn(
              "mt-2 text-xs",
              metrics.comparisons.categories > 0
                ? "text-green-500"
                : metrics.comparisons.categories < 0
                  ? "text-red-500"
                  : "text-muted-foreground",
            )}
          >
            {metrics.comparisons.categories > 0 ? "+" : ""}
            {metrics.comparisons.categories}% em relação ao mês anterior
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
