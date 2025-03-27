"use client";

import { useEffect, useMemo } from "react";
import { useDateRange } from "@/contexts/date-range-context";
import { useTransactions } from "@/contexts/transactions-context";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { cn, formatCurrency } from "@/lib/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

interface SpendingData {
  categoryName: string;
  amount: number;
  color: string;
}

export function SpendingChart() {
  const { transactions, categories, isLoading } = useTransactions();
  const { dateRange } = useDateRange();

  const spendingData = useMemo(() => {
    // Filtrar transações pelo período
    const filteredTransactions = transactions.filter(
      (t) =>
        new Date(t.date) >= dateRange.start &&
        new Date(t.date) <= dateRange.end,
    );

    // Agrupa transações por categoria
    const spending = filteredTransactions.reduce<Record<string, number>>(
      (acc, transaction) => {
        if (transaction.type === "EXPENSE") {
          const categoryId = transaction.categoryId;
          acc[categoryId] = (acc[categoryId] || 0) + Number(transaction.amount);
        }
        return acc;
      },
      {},
    );

    // Formata dados para o gráfico
    return Object.entries(spending)
      .map(([categoryId, amount]): SpendingData => {
        const category = categories.find((c) => c.id === categoryId);
        return {
          categoryName: category?.name || "Sem categoria",
          amount,
          color: category?.color || "#64f296",
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, categories, dateRange]);

  if (isLoading) {
    return <div className="h-[250px] animate-pulse bg-muted" />;
  }

  const total = spendingData.reduce((acc, item) => acc + item.amount, 0);

  const chartData = {
    labels: spendingData.map((item) => item.categoryName),
    datasets: [
      {
        data: spendingData.map((item) => item.amount),
        backgroundColor: spendingData.map((item) => item.color),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
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
        {spendingData.map((item) => {
          const percentage = ((item.amount / total) * 100).toFixed(1);
          return (
            <div key={item.categoryName} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="size-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium">{item.categoryName}</span>
                </div>
                <span>{percentage}%</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatCurrency(item.amount)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
