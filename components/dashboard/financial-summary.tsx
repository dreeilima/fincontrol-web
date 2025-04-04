"use client";

import { useEffect, useState } from "react";
import { useDateRange } from "@/contexts/date-range-context";
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
  const { summaryTransactions } = useTransactions();
  const { dateRange } = useDateRange();
  const [data, setData] = useState<FinancialData>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    economyRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Calculando resumo com transações:", summaryTransactions);

    if (summaryTransactions && summaryTransactions.length > 0) {
      try {
        // Calcula o total de receitas
        const totalIncome = summaryTransactions
          .filter((t) => t.type === "INCOME")
          .reduce((sum, t) => {
            const amount =
              typeof t.amount === "string"
                ? parseFloat(t.amount)
                : Number(t.amount);
            return sum + Math.abs(amount); // Garante valor positivo
          }, 0);

        // Calcula o total de despesas
        const totalExpense = summaryTransactions
          .filter((t) => t.type === "EXPENSE")
          .reduce((sum, t) => {
            const amount =
              typeof t.amount === "string"
                ? parseFloat(t.amount)
                : Number(t.amount);
            return sum + Math.abs(amount); // Garante valor positivo
          }, 0);

        console.log("Totais calculados (brutos):", {
          totalIncome: totalIncome.toFixed(2),
          totalExpense: totalExpense.toFixed(2),
        });

        // Calcula o saldo (receitas - despesas)
        const balance = totalIncome - totalExpense; // Agora a subtração está correta

        // Calcula a taxa de economia
        let economyRate = 0;
        if (totalIncome > 0) {
          // Se houver receita, calcula quanto foi economizado em relação à receita
          economyRate = ((totalIncome - totalExpense) / totalIncome) * 100;
          // Garante que a taxa fique entre 0% e 100%
          economyRate = Math.max(0, Math.min(100, economyRate));
        }

        console.log("Métricas calculadas (finais):", {
          receita: totalIncome.toFixed(2),
          despesa: totalExpense.toFixed(2),
          saldo: balance.toFixed(2),
          taxaEconomia: economyRate.toFixed(2),
        });

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
      setData({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        economyRate: 0,
      });
    }
  }, [summaryTransactions]);

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
            Total de entradas no período selecionado
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
            Total de saídas no período selecionado
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
