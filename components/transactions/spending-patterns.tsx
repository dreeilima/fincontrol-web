"use client";

import { useEffect, useMemo, useState } from "react";
import { useTransactions } from "@/contexts/transactions-context";
import { format, parseISO, startOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CategorySpending {
  category: string;
  categoryId: string;
  color: string | null;
  [key: string]: any; // Para os valores mensais dinâmicos
}

export function SpendingPatterns() {
  const { transactions, categories } = useTransactions();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (transactions.length > 0) {
      setIsLoading(false);
    }
  }, [transactions]);

  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    // Obter os últimos 3 meses
    const months = Array.from({ length: 3 }).map((_, i) => {
      const date = subMonths(new Date(), i);
      return {
        date,
        key: format(date, "MMM", { locale: ptBR }),
        fullKey: format(date, "yyyy-MM"),
      };
    }).reverse();

    // Criar um mapa de categorias para gastos mensais
    const categoryMap = new Map<string, CategorySpending>();

    // Inicializar o mapa com todas as categorias de despesa
    categories
      .filter(cat => cat.type === "EXPENSE")
      .forEach(category => {
        const categoryData: CategorySpending = {
          category: category.name,
          categoryId: category.id,
          color: category.color,
        };
        
        // Inicializar valores para cada mês
        months.forEach(month => {
          categoryData[month.key] = 0;
        });
        
        categoryMap.set(category.id, categoryData);
      });

    // Calcular gastos por categoria e mês
    transactions
      .filter(t => t.type === "EXPENSE")
      .forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        const monthKey = format(transactionDate, "MMM", { locale: ptBR });
        const fullMonthKey = format(transactionDate, "yyyy-MM");
        
        // Verificar se o mês está nos últimos 3 meses
        if (!months.some(m => m.key === monthKey)) return;
        
        const categoryId = transaction.categoryId;
        if (!categoryMap.has(categoryId)) {
          // Se a categoria não existir (pode acontecer se a categoria foi excluída)
          return;
        }
        
        const amount = Number(transaction.amount);
        const categoryData = categoryMap.get(categoryId)!;
        categoryData[monthKey] = (categoryData[monthKey] || 0) + amount;
      });

    // Converter o mapa em um array para o gráfico
    return Array.from(categoryMap.values())
      // Filtrar apenas categorias com gastos
      .filter(category => {
        return months.some(month => category[month.key] > 0);
      })
      // Ordenar por gasto total (decrescente)
      .sort((a, b) => {
        const totalA = months.reduce((sum, month) => sum + (a[month.key] || 0), 0);
        const totalB = months.reduce((sum, month) => sum + (b[month.key] || 0), 0);
        return totalB - totalA;
      })
      // Limitar a 5 categorias para melhor visualização
      .slice(0, 5);
  }, [transactions, categories]);

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  // Obter os nomes dos meses para o gráfico
  const monthKeys = Array.from({ length: 3 }).map((_, i) => {
    return format(subMonths(new Date(), 2 - i), "MMM", { locale: ptBR });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Padrões de Gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
              <XAxis 
                dataKey="category" 
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
                labelFormatter={(label) => `Categoria: ${label}`}
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
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
