"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowDownIcon, ArrowUpIcon, TrendingUpIcon } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReportMetrics {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  economyRate: number;
}

export function RelatorioOverview() {
  const searchParams = useSearchParams();
  const [metrics, setMetrics] = useState<ReportMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const params = new URLSearchParams(searchParams);
        const response = await fetch(
          `/api/dashboard/report?${params.toString()}`,
        );
        const data = await response.json();
        setMetrics(data.metrics);
      } catch (error) {
        console.error("Erro ao carregar métricas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadMetrics();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="h-4 w-[100px] animate-pulse bg-muted" />
              <div className="size-4 animate-pulse rounded-full bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-7 w-[120px] animate-pulse bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Total de Receitas</CardTitle>
          <ArrowUpIcon className="size-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            {formatCurrency(metrics.totalIncome)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Total de Despesas</CardTitle>
          <ArrowDownIcon className="size-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            {formatCurrency(metrics.totalExpense)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Economia</CardTitle>
          <TrendingUpIcon className="size-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500">
            {metrics.economyRate.toFixed(1)}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
