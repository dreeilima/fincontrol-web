"use client";

import { useEffect, useMemo, useState } from "react";
import { useTransactions } from "@/contexts/transactions-context";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface BudgetSettings {
  monthlyBudget: number;
  savingsGoal: number; // percentual
}

export function BudgetProgress() {
  const { transactions } = useTransactions();
  const [settings, setSettings] = useState<BudgetSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar configurações de orçamento do usuário
  useEffect(() => {
    async function fetchBudgetSettings() {
      try {
        // Temporariamente usando valores padrão
        // No futuro, buscar da API: const response = await fetch("/api/user/budget-settings");
        setSettings({
          monthlyBudget: 5000, // Valor padrão
          savingsGoal: 20, // 20% de economia
        });
      } catch (error) {
        console.error("Erro ao buscar configurações de orçamento:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBudgetSettings();
  }, []);

  const budgetMetrics = useMemo(() => {
    if (!settings) return null;

    const now = new Date();
    const firstDay = startOfMonth(now);
    const lastDay = endOfMonth(now);

    // Filtrar transações do mês atual
    const monthlyTransactions = transactions.filter(
      (t) => new Date(t.date) >= firstDay && new Date(t.date) <= lastDay
    );

    // Calcular gastos do mês
    const monthlyExpenses = monthlyTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((acc, t) => acc + Number(t.amount), 0);

    // Calcular receitas do mês
    const monthlyIncome = monthlyTransactions
      .filter((t) => t.type === "INCOME")
      .reduce((acc, t) => acc + Number(t.amount), 0);

    // Calcular percentual do orçamento já utilizado
    const budgetPercentage = Math.min(
      100,
      (monthlyExpenses / settings.monthlyBudget) * 100
    );

    // Calcular economia atual
    const currentSavings = monthlyIncome - monthlyExpenses;
    const savingsPercentage = monthlyIncome > 0 
      ? (currentSavings / monthlyIncome) * 100 
      : 0;

    // Verificar se está acima do orçamento
    const isOverBudget = monthlyExpenses > settings.monthlyBudget;

    // Verificar se está próximo do limite (>80%)
    const isNearLimit = budgetPercentage > 80 && !isOverBudget;

    // Calcular dias restantes no mês
    const daysInMonth = lastDay.getDate();
    const currentDay = now.getDate();
    const remainingDays = daysInMonth - currentDay;

    // Calcular média diária de gastos
    const dailyAverage = monthlyExpenses / currentDay;

    // Projetar gastos até o final do mês
    const projectedExpenses = monthlyExpenses + (dailyAverage * remainingDays);
    const willExceedBudget = projectedExpenses > settings.monthlyBudget;

    return {
      monthlyExpenses,
      monthlyIncome,
      budgetPercentage,
      savingsPercentage,
      isOverBudget,
      isNearLimit,
      remainingBudget: settings.monthlyBudget - monthlyExpenses,
      projectedExpenses,
      willExceedBudget,
      savingsGoalMet: savingsPercentage >= settings.savingsGoal,
    };
  }, [transactions, settings]);

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full" />;
  }

  if (!settings || !budgetMetrics) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Progresso do Orçamento</CardTitle>
        <p className="text-sm text-muted-foreground">
          {format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {formatCurrency(budgetMetrics.monthlyExpenses)} de{" "}
              {formatCurrency(settings.monthlyBudget)}
            </span>
            <span className="text-sm font-medium">
              {Math.round(budgetMetrics.budgetPercentage)}%
            </span>
          </div>
          <Progress
            value={budgetMetrics.budgetPercentage}
            className={
              budgetMetrics.isOverBudget
                ? "bg-muted [&>div]:bg-red-500"
                : budgetMetrics.isNearLimit
                ? "bg-muted [&>div]:bg-amber-500"
                : "bg-muted [&>div]:bg-emerald-500"
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Restante</p>
            <p className="text-xl font-bold">
              {formatCurrency(Math.max(0, budgetMetrics.remainingBudget))}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Economia</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold">
                {budgetMetrics.savingsPercentage.toFixed(1)}%
              </p>
              {budgetMetrics.savingsGoalMet ? (
                <TrendingUp className="size-4 text-emerald-500" />
              ) : (
                <TrendingDown className="size-4 text-rose-500" />
              )}
            </div>
          </div>
        </div>

        {(budgetMetrics.isNearLimit || budgetMetrics.isOverBudget || budgetMetrics.willExceedBudget) && (
          <Alert variant={budgetMetrics.isOverBudget ? "destructive" : "warning"}>
            <AlertCircle className="size-4" />
            <AlertTitle>
              {budgetMetrics.isOverBudget
                ? "Orçamento excedido!"
                : "Atenção!"}
            </AlertTitle>
            <AlertDescription>
              {budgetMetrics.isOverBudget
                ? "Você já ultrapassou seu orçamento mensal."
                : budgetMetrics.willExceedBudget
                ? "No ritmo atual, você ultrapassará seu orçamento este mês."
                : "Você está se aproximando do limite do seu orçamento."}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
