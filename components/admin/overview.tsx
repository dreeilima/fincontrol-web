"use client";

import {
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
import { Bar, Line } from "react-chartjs-2";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// Tipos para as opções dos gráficos
type ChartOptions = {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      position: "top";
    };
  };
  scales: {
    y: {
      beginAtZero: boolean;
    };
  };
};

// Configurações comuns dos gráficos
const chartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

interface AdminOverviewProps {
  className?: string;
}

export function AdminOverview({ className }: AdminOverviewProps) {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

  const revenueData = {
    labels: months,
    datasets: [
      {
        label: "Receita Mensal (R$)",
        data: [42000, 45000, 47000, 48950, 52000, 54000],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
        fill: true, // Adiciona preenchimento sob a linha
      },
    ],
  };

  const usersData = {
    labels: months,
    datasets: [
      {
        label: "Novos Usuários",
        data: [150, 165, 170, 180, 195, 210],
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 2,
      },
      {
        label: "Cancelamentos",
        data: [20, 18, 15, 22, 17, 19],
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Visão Geral</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="revenue">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="revenue">Receita</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
          </TabsList>
          <TabsContent value="revenue" className="space-y-4">
            <div className="h-[300px]">
              <Line options={chartOptions} data={revenueData} />
            </div>
          </TabsContent>
          <TabsContent value="users" className="space-y-4">
            <div className="h-[300px]">
              <Bar options={chartOptions} data={usersData} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
