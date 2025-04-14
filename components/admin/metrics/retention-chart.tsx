"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface RetentionData {
  month: string;
  retention: number;
  churn: number;
}

export function RetentionChart() {
  const [data, setData] = useState<RetentionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRetentionData() {
      try {
        // No futuro, buscar da API
        // const response = await fetch("/api/admin/metrics/retention");
        // const data = await response.json();
        
        // Dados simulados para demonstração
        const months = Array.from({ length: 6 }).map((_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - 5 + i);
          return format(date, "MMM", { locale: ptBR });
        });
        
        setData([
          { month: months[0], retention: 92, churn: 8 },
          { month: months[1], retention: 89, churn: 11 },
          { month: months[2], retention: 94, churn: 6 },
          { month: months[3], retention: 91, churn: 9 },
          { month: months[4], retention: 95, churn: 5 },
          { month: months[5], retention: 97, churn: 3 },
        ]);
      } catch (error) {
        console.error("Erro ao buscar dados de retenção:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRetentionData();
  }, []);

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Taxa de Retenção</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              stackOffset="expand"
              barSize={40}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickFormatter={(value) => `${value}%`}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, ""]}
                cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
              />
              <Legend />
              <Bar 
                dataKey="retention" 
                stackId="a" 
                name="Retenção" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="churn" 
                stackId="a" 
                name="Churn" 
                fill="hsl(var(--destructive))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
