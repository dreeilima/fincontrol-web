"use client";

import { useEffect, useState } from "react";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PlansDistributionData {
  labels: string[];
  values: number[];
}

export function PlansDistributionChart() {
  const [data, setData] = useState<PlansDistributionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPlansDistribution() {
      try {
        setIsLoading(true);

        // Adicionar timestamp para evitar cache
        const timestamp = new Date().getTime();
        const response = await fetch(
          `/api/admin/metrics/plans-distribution?t=${timestamp}`,
        );

        if (!response.ok) {
          throw new Error("Falha ao carregar distribuição de planos");
        }

        const result = await response.json();
        console.log("Distribuição de planos carregada:", result);

        setData({
          labels: result.labels || [],
          values: result.values || [],
        });
      } catch (error) {
        console.error("Erro ao buscar distribuição de planos:", error);
        toast.error("Erro ao carregar dados de distribuição de planos");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlansDistribution();
  }, []);

  if (isLoading || !data) {
    return <Skeleton className="h-[300px]" />;
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: [
          "rgba(59, 130, 246, 0.5)", // Azul (Básico)
          "rgba(34, 197, 94, 0.5)", // Verde (Premium)
        ],
        borderColor: ["rgb(59, 130, 246)", "rgb(34, 197, 94)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0,
            );
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} usuários (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="h-[300px]">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
