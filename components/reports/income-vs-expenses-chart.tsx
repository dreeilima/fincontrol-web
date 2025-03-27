"use client";

import { useEffect, useMemo, useState } from "react";
import { useDateRange } from "@/contexts/date-range-context";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartData {
  name: string;
  receitas: number;
  despesas: number;
}

export function IncomeVsExpensesChart() {
  const { dateRange } = useDateRange();
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const totals = useMemo(() => {
    return data.reduce(
      (acc, item) => ({
        receitas: acc.receitas + item.receitas,
        despesas: acc.despesas + item.despesas,
      }),
      { receitas: 0, despesas: 0 },
    );
  }, [data]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `/api/reports/income-expenses?startDate=${dateRange.start.toISOString()}&endDate=${dateRange.end.toISOString()}`,
        );
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Erro ao carregar dados do gráfico:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [dateRange]);

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receitas vs Despesas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground">Total Receitas</div>
            <div className="mt-1 text-2xl font-bold text-green-600">
              {formatCurrency(totals.receitas)}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground">Total Despesas</div>
            <div className="mt-1 text-2xl font-bold text-red-600">
              {formatCurrency(totals.despesas)}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground">Saldo</div>
            <div
              className={`mt-1 text-2xl font-bold ${
                totals.receitas - totals.despesas >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(totals.receitas - totals.despesas)}
            </div>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Legend />
              <Bar
                name="Receitas"
                dataKey="receitas"
                fill="hsl(var(--success))"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                name="Despesas"
                dataKey="despesas"
                fill="hsl(var(--destructive))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
