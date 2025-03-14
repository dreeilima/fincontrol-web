"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export function ExpensesByCategoryChart() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<CategoryData[]>([]);
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
          `/api/reports/expenses-by-category?startDate=${startDate}&endDate=${endDate}`,
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
      <div className="flex h-[400px] w-full items-center justify-center">
        <Skeleton className="size-[400px] rounded-full" />
      </div>
    );
  }

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), "Valor"]}
          labelFormatter={(name) => `Categoria: ${name}`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
