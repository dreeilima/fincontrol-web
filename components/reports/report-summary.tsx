"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarDaysIcon,
  PiggyBankIcon,
  TrendingDownIcon,
  Wallet,
} from "lucide-react";

import { cn, formatCurrency } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface TopExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
}

interface ReportData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
  dailyExpenseAvg: number;
  topExpenseCategories: TopExpenseCategory[];
  periodDays: number;
}

export function ReportSummary() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const response = await fetch(
          `/api/reports/summary?${new URLSearchParams({
            startDate:
              startDate ||
              new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                .toISOString()
                .split("T")[0],
            endDate: endDate || new Date().toISOString().split("T")[0],
          })}`,
        );

        if (!response.ok) {
          throw new Error("Falha ao carregar dados");
        }

        setData(await response.json());
      } catch (error) {
        console.error("Erro ao carregar dados do relatório:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-[160px] w-full" />
        <Skeleton className="h-[160px] w-full" />
        <Skeleton className="h-[160px] w-full" />
        <Skeleton className="h-[160px] w-full" />
        <Skeleton className="h-[160px] w-full" />
        <Skeleton className="h-[160px] w-full" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Receitas
          </CardTitle>
          <ArrowUpIcon className="size-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            +{formatCurrency(data.totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total de entradas no período selecionado
          </p>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Despesas
          </CardTitle>
          <ArrowDownIcon className="size-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            {formatCurrency(Math.abs(data.totalExpense))}
          </div>
          <p className="text-xs text-muted-foreground">
            Total de saídas no período selecionado
          </p>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Saldo do Período
          </CardTitle>
          <Wallet
            className={`size-4 ${data.balance >= 0 ? "text-green-500" : "text-red-500"}`}
          />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${data.balance >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {data.balance >= 0 ? "+" : "-"}
            {formatCurrency(Math.abs(data.balance))}
          </div>
          <p className="text-xs text-muted-foreground">
            Diferença entre receitas e despesas
          </p>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Taxa de Economia
          </CardTitle>
          <PiggyBankIcon className="size-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-500">
              {data.savingsRate.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">
              {data.savingsRate >= 20 ? "Ótimo!" : "Pode melhorar"}
            </div>
          </div>
          <Progress
            value={data.savingsRate}
            className={cn(
              "mt-2 h-2",
              data.savingsRate >= 20
                ? "[&>div]:bg-green-500"
                : "[&>div]:bg-yellow-500",
            )}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {data.savingsRate >= 20
              ? "Você está economizando bem!"
              : "Tente reduzir algumas despesas"}
          </p>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Média Diária de Gastos
          </CardTitle>
          <CalendarDaysIcon className="size-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-orange-500">
              {formatCurrency(data.dailyExpenseAvg)}
            </div>
            <div className="text-xs">
              em {data.periodDays} {data.periodDays === 1 ? "dia" : "dias"}
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Média de gastos diários no período
          </p>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Principais Despesas
          </CardTitle>
          <TrendingDownIcon className="size-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.topExpenseCategories.map((category) => (
              <div key={category.category}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{category.category}</span>
                  <span className="text-muted-foreground">
                    {category.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress
                    value={category.percentage}
                    className="h-2 [&>div]:bg-purple-500"
                  />
                  <span className="w-20 text-right text-sm font-medium">
                    {formatCurrency(category.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
