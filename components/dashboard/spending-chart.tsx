"use client";

import { useMemo } from "react";
import { useTransactions } from "@/contexts/transactions-context";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { endOfMonth, startOfMonth } from "date-fns";
import { Doughnut } from "react-chartjs-2";

import { cn, formatCurrency } from "@/lib/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

interface SpendingData {
  categoryName: string;
  amount: number;
  color: string;
  icon: string;
}

export function SpendingChart() {
  const { transactions, categories, isLoading } = useTransactions();

  const spendingData = useMemo(() => {
    const startDate = startOfMonth(new Date());
    const endDate = endOfMonth(new Date());

    // Filtrar transações do mês atual
    const filteredTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date >= startDate && date <= endDate;
    });

    // Agrupa transações por categoria normalizada
    const spending = filteredTransactions.reduce<
      Record<string, { amount: number; color: string | null; icon: string }>
    >((acc, transaction) => {
      if (transaction.type === "EXPENSE") {
        const category = categories.find(
          (c) => c.id === transaction.categoryId,
        );
        // Normaliza o nome da categoria (lowercase e sem acentos)
        const categoryName =
          category?.name
            ?.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") || "sem categoria";

        if (!acc[categoryName]) {
          acc[categoryName] = {
            amount: 0,
            color: category?.color || "#64f296",
            icon: category?.icon || "💰",
          };
        }
        acc[categoryName].amount += Number(transaction.amount);
      }
      return acc;
    }, {});

    // Formata dados para o gráfico
    const allCategories = Object.entries(spending)
      .map(([categoryKey, data]): SpendingData => {
        // Capitaliza a primeira letra de cada palavra
        const categoryName =
          categoryKey === "sem categoria"
            ? "Sem categoria"
            : categoryKey
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

        return {
          categoryName,
          amount: data.amount,
          color: data.color || "#64f296",
          icon: data.icon || "💰",
        };
      })
      .sort((a, b) => b.amount - a.amount);

    // Pega as 8 maiores categorias (aumentando de 6 para 8)
    const topCategories = allCategories.slice(0, 8);

    // Agrupa o resto em "Outros"
    const otherCategories = allCategories.slice(8);
    if (otherCategories.length > 0) {
      const othersAmount = otherCategories.reduce(
        (acc, item) => acc + item.amount,
        0,
      );
      topCategories.push({
        categoryName: "Outros",
        amount: othersAmount,
        color: "#6b7280", // Cor cinza para "Outros"
        icon: "💰",
      });
    }

    return topCategories;
  }, [transactions, categories]);

  if (isLoading) {
    return <div className="h-[300px] animate-pulse bg-muted" />;
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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="relative h-[300px] w-full lg:w-1/2">
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:w-1/2 lg:grid-cols-2">
        {spendingData.map((item) => {
          const percentage = ((item.amount / total) * 100).toFixed(1);
          return (
            <div
              key={item.categoryName}
              className="flex flex-col gap-1 rounded-lg p-3"
            >
              <div className="flex items-center gap-2">
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate text-sm font-medium">
                  {item.categoryName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.icon}
                </span>
              </div>
              <div className="mt-1 text-sm font-semibold">
                {formatCurrency(item.amount)}
              </div>
              <div className="text-xs text-muted-foreground">
                {percentage}% do total
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
