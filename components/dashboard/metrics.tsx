"use client";

import { useEffect, useMemo, useState } from "react";
import { useTransactions } from "@/contexts/transactions-context";
import { endOfMonth, startOfMonth } from "date-fns";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";

import { cn, formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardMetrics() {
  const { transactions } = useTransactions();
  const [isLoading, setIsLoading] = useState(true);

  const metrics = useMemo(() => {
    try {
      const startDate = startOfMonth(new Date());
      const endDate = endOfMonth(new Date());

      const filteredTransactions = transactions.filter((t) => {
        const date = new Date(t.date);
        return date >= startDate && date <= endDate;
      });

      // Calcula receitas
      const monthlyIncome = filteredTransactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => {
          const amount =
            typeof t.amount === "string"
              ? parseFloat(t.amount)
              : Number(t.amount);
          return sum + Math.abs(amount);
        }, 0);

      // Calcula despesas
      const monthlyExpense = filteredTransactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => {
          const amount =
            typeof t.amount === "string"
              ? parseFloat(t.amount)
              : Number(t.amount);
          return sum + Math.abs(amount);
        }, 0);

      // Calcula saldo e economia
      const totalBalance = monthlyIncome - monthlyExpense;
      const monthlyEconomy =
        monthlyIncome > 0
          ? ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100
          : 0;

      console.log("Métricas do Dashboard calculadas:", {
        monthlyIncome: monthlyIncome.toFixed(2),
        monthlyExpense: monthlyExpense.toFixed(2),
        totalBalance: totalBalance.toFixed(2),
        monthlyEconomy: monthlyEconomy.toFixed(2),
      });

      return {
        monthlyIncome,
        monthlyExpense,
        totalBalance,
        monthlyEconomy,
      };
    } catch (error) {
      console.error("Erro ao calcular métricas:", error);
      return {
        monthlyIncome: 0,
        monthlyExpense: 0,
        totalBalance: 0,
        monthlyEconomy: 0,
      };
    }
  }, [transactions]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px]" />
        ))}
      </div>
    );
  }

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
          isCurrency: false,
          suffix: "%",
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
            <div className={cn("text-2xl font-bold", metric.className)}>
              {metric.isCurrency === false
                ? `${metric.value.toFixed(1)}${metric.suffix || ""}`
                : formatCurrency(metric.value)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
