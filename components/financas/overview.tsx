"use client";

import { useEffect, useMemo, useState } from "react";
import { useTransactions } from "@/contexts/transactions-context";
import { endOfMonth, startOfMonth } from "date-fns";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarSign,
  Loader2,
  TrendingDown,
  TrendingUp,
  WalletIcon,
} from "lucide-react";

import { cn, formatCurrency } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface OverviewData {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  lastUpdate: Date;
}

export function FinancasOverview() {
  const { transactions } = useTransactions();

  // Calcular métricas usando useMemo para melhor performance
  const metrics = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const expense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const balance = income - expense;

    return {
      income,
      expense,
      balance,
    };
  }, [transactions]); // Recalcula apenas quando transactions mudar

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Saldo Total</CardTitle>
          <DollarSign className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(metrics.balance)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Receitas</CardTitle>
          <TrendingUp className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            {formatCurrency(metrics.income)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Despesas</CardTitle>
          <TrendingDown className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            {formatCurrency(metrics.expense)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
