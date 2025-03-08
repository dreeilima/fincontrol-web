"use client";

import {
  ArcElement,
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
import { CalendarIcon } from "lucide-react";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

export function AdminReports() {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

  return (
    <div className="grid gap-4 sm:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Select defaultValue="2024">
          <SelectTrigger className="w-[180px]">
            <CalendarIcon className="mr-2 size-4" />
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
          </SelectContent>
        </Select>
        <Button>Exportar Relatórios</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 293.850,00</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao ano anterior
            </p>
            <div className="mt-4 h-[200px]">
              <Line
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } },
                }}
                data={{
                  labels: months,
                  datasets: [
                    {
                      data: [42000, 45000, 47000, 48950, 52000, 54000],
                      borderColor: "rgb(34, 197, 94)",
                      backgroundColor: "rgba(34, 197, 94, 0.5)",
                      tension: 0.3,
                    },
                  ],
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.853</div>
            <p className="text-xs text-muted-foreground">+180 novos este mês</p>
            <div className="mt-4 h-[200px]">
              <Bar
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } },
                }}
                data={{
                  labels: months,
                  datasets: [
                    {
                      data: [2450, 2550, 2650, 2750, 2850, 2950],
                      backgroundColor: "rgba(59, 130, 246, 0.5)",
                      borderColor: "rgb(59, 130, 246)",
                    },
                  ],
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Planos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-4 h-[200px]">
              <Doughnut
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
                data={{
                  labels: ["Basic", "Pro"],
                  datasets: [
                    {
                      data: [1853, 1000],
                      backgroundColor: [
                        "rgba(59, 130, 246, 0.5)",
                        "rgba(34, 197, 94, 0.5)",
                      ],
                      borderColor: ["rgb(59, 130, 246)", "rgb(34, 197, 94)"],
                    },
                  ],
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Análise Detalhada</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="revenue" className="space-y-4">
            <TabsList>
              <TabsTrigger value="revenue">Receita</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
              <TabsTrigger value="conversion">Conversão</TabsTrigger>
            </TabsList>
            <TabsContent value="revenue" className="h-[400px]">
              <Line
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top" as const,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
                data={{
                  labels: months,
                  datasets: [
                    {
                      label: "Receita Total",
                      data: [42000, 45000, 47000, 48950, 52000, 54000],
                      borderColor: "rgb(34, 197, 94)",
                      backgroundColor: "rgba(34, 197, 94, 0.5)",
                      tension: 0.3,
                    },
                    {
                      label: "Custos",
                      data: [15000, 15500, 16000, 16200, 16500, 17000],
                      borderColor: "rgb(239, 68, 68)",
                      backgroundColor: "rgba(239, 68, 68, 0.5)",
                      tension: 0.3,
                    },
                  ],
                }}
              />
            </TabsContent>
            {/* Adicionar outros gráficos para as outras tabs */}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
