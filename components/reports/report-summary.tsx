"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowDownIcon, ArrowUpIcon, TrendingUp, Wallet } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ReportData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
}

export function ReportSummary() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const startDate =
          searchParams.get("startDate") ||
          new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            .toISOString()
            .split("T")[0];
        const endDate =
          searchParams.get("endDate") || new Date().toISOString().split("T")[0];

        console.log("Fetching data with dates:", { startDate, endDate });

        const response = await fetch(
          `/api/reports/summary?startDate=${startDate}&endDate=${endDate}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `API Error: ${errorData.error || response.statusText}`,
          );
        }

        const data = await response.json();
        console.log("Received data:", data);
        setData(data);
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
      <>
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
      </>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Receitas
          </CardTitle>
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
          <CardTitle className="text-sm font-medium">
            Total de Despesas
          </CardTitle>
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
          <CardTitle className="text-sm font-medium">
            Saldo do Período
          </CardTitle>
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
    </>
  );
}
