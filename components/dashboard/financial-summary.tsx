"use client";

import { useEffect, useState } from "react";
import { useTransactions } from "@/contexts/transactions-context";
import { ArrowDownIcon, ArrowUpIcon, DollarSign, Wallet } from "lucide-react";

import { formatCurrency } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface FinancialData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  economyRate: number;
}

export function FinancialSummary() {
  const { transactions } = useTransactions();
  const [data, setData] = useState<FinancialData>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    economyRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentTransactions = transactions.filter(
          (t) => new Date(t.date) >= thirtyDaysAgo,
        );

        const totalIncome = recentTransactions
          .filter((t) => t.type === "INCOME")
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const totalExpense = recentTransactions
          .filter((t) => t.type === "EXPENSE")
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const balance = totalIncome - totalExpense;
        const economyRate =
          totalIncome > 0
            ? Math.max(0, Math.min(100, (balance / totalIncome) * 100))
            : 0;

        setData({
          totalIncome,
          totalExpense,
          balance,
          economyRate,
        });
      } catch (error) {
        console.error("Erro ao calcular métricas:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [transactions]);

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
