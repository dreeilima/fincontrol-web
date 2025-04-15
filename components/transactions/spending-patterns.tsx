"use client";

import { useEffect, useMemo, useState } from "react";
import { useTransactions } from "@/contexts/transactions-context";
import { format, parseISO, startOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTheme } from "next-themes";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn, formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategorySpending {
  category: string;
  categoryId: string;
  color: string | null;
  icon: string | null;
  total: number;
  [key: string]: any; // Para os valores mensais dinâmicos
}

export function SpendingPatterns() {
  const { transactions, categories } = useTransactions();
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"monthly" | "total">("monthly");
  const [monthCount, setMonthCount] = useState<"3" | "6">("3");
  const [forceUpdate, setForceUpdate] = useState(0);
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === "dark";

  useEffect(() => {
    if (transactions.length > 0) {
      setIsLoading(false);
    }
  }, [transactions]);

  // Forçar recálculo quando as opções mudarem
  useEffect(() => {
    setForceUpdate((prev) => prev + 1);
    console.log(
      "Opções atualizadas - viewMode:",
      viewMode,
      "monthCount:",
      monthCount,
    );
  }, [viewMode, monthCount]);

  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    // Obter os últimos meses
    const count = parseInt(monthCount);
    const months = Array.from({ length: count })
      .map((_, i) => {
        const date = subMonths(new Date(), i);
        return {
          date,
          key: format(date, "MMM", { locale: ptBR }),
          fullKey: format(date, "yyyy-MM"),
        };
      })
      .reverse();

    // Criar um mapa de categorias para gastos mensais
    const categoryMap = new Map<string, CategorySpending>();

    // Inicializar o mapa com todas as categorias de despesa
    categories
      .filter((cat) => cat.type === "EXPENSE")
      .forEach((category) => {
        const categoryData: CategorySpending = {
          category: category.name,
          categoryId: category.id,
          color: category.color,
          icon: category.icon,
          total: 0,
        };

        // Inicializar valores para cada mês
        months.forEach((month) => {
          categoryData[month.key] = 0;
        });

        categoryMap.set(category.id, categoryData);
      });

    // Calcular gastos por categoria e mês
    transactions
      .filter((t) => t.type === "EXPENSE")
      .forEach((transaction) => {
        const transactionDate = new Date(transaction.date);
        const monthKey = format(transactionDate, "MMM", { locale: ptBR });
        const fullMonthKey = format(transactionDate, "yyyy-MM");

        // Verificar se o mês está nos últimos N meses
        if (!months.some((m) => m.key === monthKey)) return;

        const categoryId = transaction.categoryId || "sem-categoria";
        if (!categoryMap.has(categoryId)) {
          // Se a categoria não existir, criar uma entrada para "Sem categoria"
          const categoryData: CategorySpending = {
            category: "Sem categoria",
            categoryId: "sem-categoria",
            color: "#6b7280",
            icon: "💰",
            total: 0,
          };

          months.forEach((month) => {
            categoryData[month.key] = 0;
          });

          categoryMap.set(categoryId, categoryData);
        }

        const amount = Number(transaction.amount);
        const categoryData = categoryMap.get(categoryId)!;
        categoryData[monthKey] = (categoryData[monthKey] || 0) + amount;
        categoryData.total = (categoryData.total || 0) + amount;
      });

    // Converter o mapa em um array para o gráfico
    return (
      Array.from(categoryMap.values())
        // Filtrar apenas categorias com gastos
        .filter((category) => {
          return category.total > 0;
        })
        // Ordenar por gasto total (decrescente)
        .sort((a, b) => b.total - a.total)
        // Limitar a 8 categorias para melhor visualização
        .slice(0, 8)
    );
  }, [transactions, categories, monthCount, forceUpdate]);

  // Calcular dados para o gráfico de pizza (modo total)
  const pieData = useMemo(() => {
    const total = chartData.reduce((sum, category) => sum + category.total, 0);

    // Retornar dados processados para o gráfico
    return chartData.map((category) => ({
      name: category.category,
      value: category.total,
      color: category.color || "#6b7280",
      percentage: ((category.total / total) * 100).toFixed(1) + "%",
    }));
  }, [chartData]);

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  // Obter os nomes dos meses para o gráfico
  const count = parseInt(monthCount);
  const monthKeys = Array.from({ length: count }).map((_, i) => {
    return format(subMonths(new Date(), count - 1 - i), "MMM", {
      locale: ptBR,
    });
  });

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill={pieData[index].color}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {name} ({pieData[index].percentage})
      </text>
    ) : null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Padrões de Gastos</CardTitle>
        <div className="flex gap-2">
          <Tabs
            value={viewMode}
            onValueChange={(value) => {
              console.log("Mudando modo de visualização para:", value);
              setViewMode(value as "monthly" | "total");
            }}
            className="w-[180px]"
            id="spending-view-mode-tabs"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="monthly">Mensal</TabsTrigger>
              <TabsTrigger value="total">Total</TabsTrigger>
            </TabsList>
          </Tabs>

          {viewMode === "monthly" && (
            <Tabs
              value={monthCount}
              onValueChange={(value) => {
                console.log("Mudando período para:", value);
                setMonthCount(value as "3" | "6");
              }}
              className="w-[120px]"
              id="spending-month-count-tabs"
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="3">3m</TabsTrigger>
                <TabsTrigger value="6">6m</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === "monthly" ? (
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  tick={{ fontSize: 12 }}
                  height={60}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                  width={80}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), ""]}
                  labelFormatter={(label) => `Categoria: ${label}`}
                  contentStyle={{
                    backgroundColor: isDarkTheme
                      ? "hsl(215, 28%, 17%)"
                      : "#fff",
                    borderColor: isDarkTheme ? "hsl(215, 16%, 47%)" : "#e5e7eb",
                    color: isDarkTheme ? "#f9fafb" : "#111827",
                    borderRadius: "6px",
                    padding: "10px",
                    boxShadow: isDarkTheme
                      ? "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
                      : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  itemStyle={{
                    color: isDarkTheme ? "#d1d5db" : "#374151",
                  }}
                  labelStyle={{
                    fontWeight: "bold",
                    marginBottom: "5px",
                    color: isDarkTheme ? "#f3f4f6" : "#111827",
                  }}
                />
                <Legend />
                {monthKeys.map((month, index) => (
                  <Bar
                    key={month}
                    dataKey={month}
                    name={month}
                    fill={`hsl(${220 + index * 30}, 70%, 50%)`}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Gasto Total",
                  ]}
                  labelFormatter={(label) => `Categoria: ${label}`}
                  contentStyle={{
                    backgroundColor: isDarkTheme
                      ? "hsl(215, 28%, 17%)"
                      : "#fff",
                    borderColor: isDarkTheme ? "hsl(215, 16%, 47%)" : "#e5e7eb",
                    color: isDarkTheme ? "#f9fafb" : "#111827",
                    borderRadius: "6px",
                    padding: "10px",
                    boxShadow: isDarkTheme
                      ? "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
                      : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  itemStyle={{
                    color: isDarkTheme ? "#d1d5db" : "#374151",
                  }}
                  labelStyle={{
                    fontWeight: "bold",
                    marginBottom: "5px",
                    color: isDarkTheme ? "#f3f4f6" : "#111827",
                  }}
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
