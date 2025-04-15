"use client";

import { useEffect, useMemo, useState } from "react";
import { useTransactions } from "@/contexts/transactions-context";
import {
  format,
  isAfter,
  isBefore,
  isEqual,
  parseISO,
  subDays,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTheme } from "next-themes";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChartData {
  date: string;
  formattedDate: string;
  balance: number;
  netFlow: number;
  income: number;
  expense: number;
}

export function CashFlowAnalysis() {
  const { transactions } = useTransactions();
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"30" | "60" | "90">("30");
  const [forceUpdate, setForceUpdate] = useState(0);
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === "dark";

  useEffect(() => {
    if (transactions.length > 0) {
      setIsLoading(false);
    }
  }, [transactions]);

  // Força recálculo quando timeRange mudar
  useEffect(() => {
    setForceUpdate((prev) => prev + 1);
    console.log("timeRange mudou para:", timeRange);
  }, [timeRange]);

  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    // Ordenar transações por data
    const sortedTransactions = [...transactions].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

    // Encontrar a data mais antiga e mais recente
    const oldestDate = new Date(sortedTransactions[0].date);
    const latestDate = new Date(
      sortedTransactions[sortedTransactions.length - 1].date,
    );

    // Determinar a data de início baseada na seleção do usuário
    const daysToLookBack = parseInt(timeRange);
    const startDate = isAfter(subDays(new Date(), daysToLookBack), oldestDate)
      ? subDays(new Date(), daysToLookBack)
      : oldestDate;

    // Criar mapas para saldos e fluxos diários
    const balanceMap = new Map<string, number>();
    const incomeMap = new Map<string, number>();
    const expenseMap = new Map<string, number>();
    const netFlowMap = new Map<string, number>();

    let runningBalance = 0;

    // Inicializar o mapa com todas as datas no intervalo
    let currentDate = new Date(startDate);
    while (
      isBefore(currentDate, latestDate) ||
      isEqual(currentDate, latestDate)
    ) {
      const dateKey = format(currentDate, "yyyy-MM-dd");
      balanceMap.set(dateKey, runningBalance);
      incomeMap.set(dateKey, 0);
      expenseMap.set(dateKey, 0);
      netFlowMap.set(dateKey, 0);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calcular o saldo acumulado para cada data
    sortedTransactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);

      // Ignorar transações anteriores à data de início
      if (isBefore(transactionDate, startDate)) return;

      const dateKey = format(transactionDate, "yyyy-MM-dd");
      const amount = Number(transaction.amount);

      if (transaction.type === "INCOME") {
        incomeMap.set(dateKey, (incomeMap.get(dateKey) || 0) + amount);
        runningBalance += amount;
      } else {
        expenseMap.set(dateKey, (expenseMap.get(dateKey) || 0) + amount);
        runningBalance -= amount;
      }

      netFlowMap.set(
        dateKey,
        (incomeMap.get(dateKey) || 0) - (expenseMap.get(dateKey) || 0),
      );
      balanceMap.set(dateKey, runningBalance);
    });

    // Converter o mapa em um array para o gráfico
    const result: ChartData[] = [];

    // Usar Array.from para garantir a ordem correta
    Array.from(balanceMap.entries())
      .sort(([aDate], [bDate]) => {
        return parseISO(aDate).getTime() - parseISO(bDate).getTime();
      })
      .forEach(([dateStr, balance]) => {
        result.push({
          date: dateStr,
          formattedDate: format(parseISO(dateStr), "dd/MM", { locale: ptBR }),
          balance,
          netFlow: netFlowMap.get(dateStr) || 0,
          income: incomeMap.get(dateStr) || 0,
          expense: expenseMap.get(dateStr) || 0,
        });
      });

    return result;
  }, [transactions, timeRange, forceUpdate]);

  const getGradientOffset = () => {
    if (chartData.length === 0) return 0;

    const dataMax = Math.max(...chartData.map((i) => i.balance));
    const dataMin = Math.min(...chartData.map((i) => i.balance));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  const gradientOffset = getGradientOffset();

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Fluxo de Caixa</CardTitle>
        <Tabs
          value={timeRange}
          onValueChange={(value) => {
            console.log("Mudando período para:", value);
            setTimeRange(value as "30" | "60" | "90");
          }}
          className="w-[180px]"
          id="cash-flow-time-tabs"
        >
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="30">30d</TabsTrigger>
            <TabsTrigger value="60">60d</TabsTrigger>
            <TabsTrigger value="90">90d</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset={gradientOffset}
                    stopColor="rgba(16, 185, 129, 0.8)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset={gradientOffset}
                    stopColor="rgba(239, 68, 68, 0.8)"
                    stopOpacity={0.8}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
                opacity={0.3}
              />
              <XAxis
                dataKey="formattedDate"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
                width={80}
              />
              <Tooltip
                formatter={(value: number, name) => {
                  const labels = {
                    balance: "Saldo",
                    netFlow: "Fluxo Líquido",
                    income: "Receita",
                    expense: "Despesa",
                  };
                  return [
                    formatCurrency(value),
                    labels[name as keyof typeof labels],
                  ];
                }}
                labelFormatter={(label) => `Data: ${label}`}
                contentStyle={{
                  backgroundColor: isDarkTheme ? "hsl(215, 28%, 17%)" : "#fff",
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
              <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="balance"
                name="Saldo"
                stroke="#10b981"
                fill="url(#splitColor)"
                fillOpacity={0.6}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="netFlow"
                name="Fluxo Líquido"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.2}
                strokeWidth={1.5}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
