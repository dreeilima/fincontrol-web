"use client";

import { useEffect, useMemo, useState } from "react";
import { useTransactions } from "@/contexts/transactions-context";
import { addMonths, format, startOfMonth } from "date-fns";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ForecastData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
  forecast: boolean;
}

export function FinancialForecast() {
  const { transactions } = useTransactions();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (transactions.length > 0) {
      setIsLoading(false);
    }
  }, [transactions]);

  const forecastData = useMemo(() => {
    if (!transactions.length) return [];

    // Agrupar transações por mês
    const monthlyData = new Map<string, { income: number; expenses: number }>();
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = format(date, "yyyy-MM");
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { income: 0, expenses: 0 });
      }
      
      const data = monthlyData.get(monthKey)!;
      const amount = Number(transaction.amount);
      
      if (transaction.type === "INCOME") {
        data.income += amount;
      } else {
        data.expenses += amount;
      }
    });

    // Converter para array e ordenar por data
    const historicalData = Array.from(monthlyData.entries())
      .map(([monthKey, data]) => {
        const [year, month] = monthKey.split("-");
        return {
          date: new Date(parseInt(year), parseInt(month) - 1, 1),
          monthKey,
          ...data,
          balance: data.income - data.expenses,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    // Pegar os últimos 6 meses para análise
    const recentMonths = historicalData.slice(-6);
    
    if (recentMonths.length < 2) {
      // Não temos dados suficientes para previsão
      return [];
    }

    // Calcular médias para previsão
    const avgIncome = recentMonths.reduce((sum, item) => sum + item.income, 0) / recentMonths.length;
    const avgExpenses = recentMonths.reduce((sum, item) => sum + item.expenses, 0) / recentMonths.length;
    
    // Calcular tendência (crescimento médio mensal)
    const incomeTrend = recentMonths.length > 1 
      ? (recentMonths[recentMonths.length - 1].income - recentMonths[0].income) / (recentMonths.length - 1)
      : 0;
    
    const expensesTrend = recentMonths.length > 1
      ? (recentMonths[recentMonths.length - 1].expenses - recentMonths[0].expenses) / (recentMonths.length - 1)
      : 0;

    // Criar dados para o gráfico (últimos 3 meses + próximos 3 meses)
    const chartData: ForecastData[] = [];
    
    // Adicionar dados históricos (últimos 3 meses)
    recentMonths.slice(-3).forEach(item => {
      chartData.push({
        month: format(item.date, "MMM", { locale: ptBR }),
        income: item.income,
        expenses: item.expenses,
        balance: item.balance,
        forecast: false,
      });
    });
    
    // Adicionar previsão para os próximos 3 meses
    const lastMonth = recentMonths[recentMonths.length - 1].date;
    
    for (let i = 1; i <= 3; i++) {
      const forecastMonth = addMonths(lastMonth, i);
      const forecastedIncome = avgIncome + (incomeTrend * i);
      const forecastedExpenses = avgExpenses + (expensesTrend * i);
      
      chartData.push({
        month: format(forecastMonth, "MMM", { locale: ptBR }),
        income: Math.max(0, forecastedIncome),
        expenses: Math.max(0, forecastedExpenses),
        balance: forecastedIncome - forecastedExpenses,
        forecast: true,
      });
    }
    
    return chartData;
  }, [transactions]);

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (forecastData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Previsão Financeira</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Dados insuficientes para gerar previsão. Adicione mais transações.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previsão Financeira</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={forecastData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
                width={80}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), ""]}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                name="Receitas"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name="Despesas"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="balance"
                name="Saldo"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          <p>* Os últimos 3 meses são dados históricos, os próximos 3 são previsões baseadas em tendências.</p>
        </div>
      </CardContent>
    </Card>
  );
}
