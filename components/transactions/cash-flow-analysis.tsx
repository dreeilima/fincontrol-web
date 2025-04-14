"use client";

import { useEffect, useMemo, useState } from "react";
import { useTransactions } from "@/contexts/transactions-context";
import { format, isAfter, isBefore, isEqual, parseISO, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartData {
  date: string;
  balance: number;
}

export function CashFlowAnalysis() {
  const { transactions } = useTransactions();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (transactions.length > 0) {
      setIsLoading(false);
    }
  }, [transactions]);

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
    const latestDate = new Date(sortedTransactions[sortedTransactions.length - 1].date);
    
    // Se a data mais antiga for muito distante, limitar a 30 dias atrás
    const startDate = isAfter(subDays(new Date(), 30), oldestDate) 
      ? subDays(new Date(), 30) 
      : oldestDate;

    // Criar um mapa de datas para saldos
    const balanceMap = new Map<string, number>();
    let runningBalance = 0;

    // Inicializar o mapa com todas as datas no intervalo
    let currentDate = new Date(startDate);
    while (isBefore(currentDate, latestDate) || isEqual(currentDate, latestDate)) {
      const dateKey = format(currentDate, "yyyy-MM-dd");
      balanceMap.set(dateKey, 0);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calcular o saldo acumulado para cada data
    sortedTransactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      
      // Ignorar transações anteriores à data de início
      if (isBefore(transactionDate, startDate)) return;
      
      const dateKey = format(transactionDate, "yyyy-MM-dd");
      const amount = Number(transaction.amount);
      const value = transaction.type === "INCOME" ? amount : -amount;
      
      runningBalance += value;
      balanceMap.set(dateKey, runningBalance);
    });

    // Converter o mapa em um array para o gráfico
    const result: ChartData[] = [];
    balanceMap.forEach((balance, dateStr) => {
      result.push({
        date: format(parseISO(dateStr), "dd/MM"),
        balance,
      });
    });

    return result.sort((a, b) => {
      const dateA = parseISO(a.date.split("/").reverse().join("-"));
      const dateB = parseISO(b.date.split("/").reverse().join("-"));
      return dateA.getTime() - dateB.getTime();
    });
  }, [transactions]);

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fluxo de Caixa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
              <XAxis 
                dataKey="date" 
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
                formatter={(value: number) => [formatCurrency(value), "Saldo"]}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorBalance)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
