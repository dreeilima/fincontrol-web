"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
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

const CHART_COLORS = {
  income: "#22c55e", // Verde mais vivo
  expenses: "#ef4444", // Vermelho mais vivo
  balance: "#3b82f6", // Azul mais vivo
};

interface ChartData {
  date: string;
  income: number;
  expenses: number;
  balance: number;
}

interface ApiResponse {
  data: ChartData[];
  granularity: "day" | "week" | "month";
}

export function MonthlyTrendsChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [granularity, setGranularity] = useState<"day" | "week" | "month">(
    "month",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const response = await fetch(
          `/api/reports/monthly-trends?${new URLSearchParams({
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

        const { data: chartData, granularity: chartGranularity } =
          (await response.json()) as ApiResponse;

        const formattedData = chartData.map((item) => ({
          ...item,
          displayDate: formatDate(item.date, chartGranularity),
          income: Number(item.income || 0),
          expenses: -Math.abs(Number(item.expenses || 0)), // Força despesas como negativas
          balance: Number(item.balance || 0),
        }));

        setData(formattedData);
        setGranularity(chartGranularity);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError(
          error instanceof Error ? error.message : "Erro ao carregar dados",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [searchParams]);

  const formatDate = (
    dateStr: string,
    granularity: "day" | "week" | "month",
  ) => {
    const date = parseISO(dateStr);
    switch (granularity) {
      case "day":
        return format(date, "dd/MM", { locale: ptBR });
      case "week":
        return `Semana ${format(date, "w", { locale: ptBR })}`;
      case "month":
        return format(date, "MMM/yy", { locale: ptBR });
      default:
        return dateStr;
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  if (error) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <p className="text-destructive">Erro: {error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <p className="text-muted-foreground">
          Nenhum dado disponível para o período selecionado
        </p>
      </div>
    );
  }

  // Encontra os valores máximo e mínimo para ajustar a escala
  const maxValue = Math.max(...data.map((d) => Math.max(d.income, d.balance)));
  const minValue = Math.min(
    ...data.map((d) => Math.min(d.expenses, d.balance)),
  );
  const absMax = Math.max(Math.abs(maxValue), Math.abs(minValue));
  const domain = [-absMax, absMax];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-muted"
          opacity={0.3}
        />
        <XAxis
          dataKey="displayDate"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          interval={granularity === "day" ? 2 : 0} // Pula alguns labels se for diário
          stroke="#666"
        />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatCurrency(value)}
          width={100}
          domain={domain}
          stroke="#666"
        />
        <Tooltip
          formatter={(value: number, name: string) => {
            const label =
              {
                income: "Receitas",
                expenses: "Despesas",
                balance: "Saldo",
              }[name] || name;
            return [`${label}: ${formatCurrency(value)}`, ""];
          }}
          labelFormatter={(label) => `Data: ${label}`}
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
            padding: "8px",
          }}
          itemStyle={{ color: "#666" }}
        />
        <Legend
          verticalAlign="top"
          height={36}
          formatter={(value) => (
            <span style={{ color: "#666", fontSize: "12px" }}>{value}</span>
          )}
        />
        <Line
          name="Receitas"
          type="monotone"
          dataKey="income"
          stroke={CHART_COLORS.income}
          strokeWidth={2}
          dot={{ strokeWidth: 2, r: 4, fill: CHART_COLORS.income }}
          activeDot={{ r: 6, fill: CHART_COLORS.income }}
        />
        <Line
          name="Despesas"
          type="monotone"
          dataKey="expenses"
          stroke={CHART_COLORS.expenses}
          strokeWidth={2}
          dot={{ strokeWidth: 2, r: 4, fill: CHART_COLORS.expenses }}
          activeDot={{ r: 6, fill: CHART_COLORS.expenses }}
        />
        <Line
          name="Saldo"
          type="monotone"
          dataKey="balance"
          stroke={CHART_COLORS.balance}
          strokeWidth={2}
          dot={{ strokeWidth: 2, r: 4, fill: CHART_COLORS.balance }}
          activeDot={{ r: 6, fill: CHART_COLORS.balance }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
