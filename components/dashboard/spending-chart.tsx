"use client";

import { useEffect, useState } from "react";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { cn, formatCurrency } from "@/lib/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

interface SpendingData {
  categoryName: string;
  _sum: {
    amount: number;
  };
}

const COLORS = [
  "rgb(59, 130, 246)", // blue-500
  "rgb(16, 185, 129)", // emerald-500
  "rgb(239, 68, 68)", // red-500
  "rgb(245, 158, 11)", // amber-500
  "rgb(99, 102, 241)", // indigo-500
  "rgb(236, 72, 153)", // pink-500
];

export function SpendingChart() {
  const [data, setData] = useState<SpendingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSpending() {
      try {
        const response = await fetch("/api/dashboard/spending");
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Erro ao carregar gastos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSpending();
  }, []);

  if (isLoading) {
    return <div className="h-[250px] animate-pulse bg-muted" />;
  }

  const total = data.reduce((acc, item) => acc + Number(item._sum.amount), 0);

  const chartData = {
    labels: data.map((item) => item.categoryName),
    datasets: [
      {
        data: data.map((item) => Number(item._sum.amount)),
        backgroundColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Removemos a legenda do gráfico pois teremos nossa própria lista
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `${context.label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
  };

  return (
    <div className="flex gap-8">
      <div className="relative h-[250px] flex-1">
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="flex w-[200px] flex-col gap-2">
        {data.map((item, index) => {
          const percentage = ((Number(item._sum.amount) / total) * 100).toFixed(
            1,
          );
          return (
            <div key={item.categoryName} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="size-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="font-medium">{item.categoryName}</span>
                </div>
                <span>{percentage}%</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatCurrency(Number(item._sum.amount))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
