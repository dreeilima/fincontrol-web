"use client";

import { useEffect, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, DollarSign, Wallet } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface FinancialData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  economyRate: number;
}

export function FinancialSummary() {
  const [data, setData] = useState<FinancialData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/dashboard/report?period=30");
        const result = await response.json();
        setData(result.metrics);
      } catch (error) {
        console.error("Erro ao carregar resumo financeiro:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full" />
          ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receitas</CardTitle>
          <ArrowUpIcon className="size-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            {formatCurrency(data?.totalIncome || 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total de entradas nos últimos 30 dias
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas</CardTitle>
          <ArrowDownIcon className="size-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            {formatCurrency(data?.totalExpense || 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total de saídas nos últimos 30 dias
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo</CardTitle>
          <Wallet className="size-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500">
            {formatCurrency(data?.balance || 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            Diferença entre receitas e despesas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Taxa de Economia
          </CardTitle>
          <DollarSign className="size-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-500">
            {data?.economyRate.toFixed(1) || 0}%
          </div>
          <p className="text-xs text-muted-foreground">
            Percentual economizado das receitas
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
