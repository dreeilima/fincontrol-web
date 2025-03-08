"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";

import { cn, formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardMetrics {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyEconomy: number;
}

export function DashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    monthlyEconomy: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/dashboard/metrics");
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error("Erro ao carregar métricas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadMetrics();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[
        {
          title: "Saldo Total",
          value: metrics.totalBalance,
          icon: WalletIcon,
          className: "text-muted-foreground",
        },
        {
          title: "Receitas do Mês",
          value: metrics.monthlyIncome,
          icon: ArrowUpIcon,
          className: "text-emerald-500",
        },
        {
          title: "Despesas do Mês",
          value: metrics.monthlyExpense,
          icon: ArrowDownIcon,
          className: "text-rose-500",
        },
        {
          title: "Economia do Mês",
          value: metrics.monthlyEconomy,
          icon: TrendingUpIcon,
          className: "text-blue-500",
        },
      ].map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className={cn("size-4", metric.className)} />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-[120px]" />
            ) : (
              <div className={cn("text-2xl font-bold", metric.className)}>
                {formatCurrency(metric.value)}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
