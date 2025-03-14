"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface TrendData {
  name: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

export function MonthlyTrendsChart() {
  const [data, setData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const currentYear = new Date().getFullYear();
        const response = await fetch(
          `/api/reports/monthly-trends?year=${currentYear}`,
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
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full flex-col gap-4">
        <div className="flex justify-between px-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
        <div className="relative size-full">
          <Skeleton className="absolute inset-0 size-full" />
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
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
        <Line
          type="monotone"
          dataKey="receitas"
          name="Receitas"
          stroke="#22c55e"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="despesas"
          name="Despesas"
          stroke="#ef4444"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="saldo"
          name="Saldo"
          stroke="#3b82f6"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
