"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface ChartData {
  spendingByCategory: {
    categoryName: string;
    _sum: { amount: number };
  }[];
  dailyBalance: {
    date: string;
    _sum: { amount: number };
  }[];
}

const COLORS = [
  "rgb(59, 130, 246)", // blue-500
  "rgb(16, 185, 129)", // emerald-500
  "rgb(239, 68, 68)", // red-500
  "rgb(245, 158, 11)", // amber-500
  "rgb(99, 102, 241)", // indigo-500
  "rgb(236, 72, 153)", // pink-500
];

export function RelatorioCharts() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadChartData() {
      try {
        const params = new URLSearchParams(searchParams);
        const response = await fetch(
          `/api/dashboard/report?${params.toString()}`,
        );
        const data = await response.json();
        setData({
          spendingByCategory: data.spendingByCategory,
          dailyBalance: data.dailyBalance,
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadChartData();
  }, [searchParams]);

  if (isLoading) {
    return <div className="h-[400px] animate-pulse rounded-md bg-muted" />;
  }

  if (!data) return null;

  const spendingData = {
    labels: data.spendingByCategory.map((item) => item.categoryName),
    datasets: [
      {
        label: "Gastos por Categoria",
        data: data.spendingByCategory.map((item) => Number(item._sum.amount)),
        backgroundColor: COLORS,
      },
    ],
  };

  const balanceData = {
    labels: data.dailyBalance.map((item) =>
      new Date(item.date).toLocaleDateString("pt-BR"),
    ),
    datasets: [
      {
        label: "Saldo Diário",
        data: data.dailyBalance.map((item) => Number(item._sum.amount)),
        borderColor: "rgb(59, 130, 246)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return formatCurrency(value);
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise Gráfica</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="spending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="spending">Gastos por Categoria</TabsTrigger>
            <TabsTrigger value="balance">Evolução do Saldo</TabsTrigger>
          </TabsList>
          <TabsContent value="spending" className="space-y-4">
            <div className="h-[400px]">
              <Bar options={options} data={spendingData} />
            </div>
          </TabsContent>
          <TabsContent value="balance" className="space-y-4">
            <div className="h-[400px]">
              <Line options={options} data={balanceData} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
