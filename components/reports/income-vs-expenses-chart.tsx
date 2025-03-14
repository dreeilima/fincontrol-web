"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartData {
  name: string;
  receitas: number;
  despesas: number;
}

export function IncomeVsExpensesChart() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<ChartData[]>([]);
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

        const response = await fetch(
          `/api/reports/income-expenses?startDate=${startDate}&endDate=${endDate}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar dados do gráfico");
        }

        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Erro ao carregar dados do gráfico:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-[350px] w-full" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `R$${value / 1000}k`} />
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), ""]}
          labelFormatter={(label) => `Mês: ${label}`}
        />
        <Legend />
        <Bar dataKey="receitas" name="Receitas" fill="#22c55e" />
        <Bar dataKey="despesas" name="Despesas" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  );
}
