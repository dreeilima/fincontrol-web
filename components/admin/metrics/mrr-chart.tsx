"use client";

import { useEffect, useState } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MRRChartData {
  labels: string[];
  values: number[];
}

export function MRRChart() {
  const [data, setData] = useState<MRRChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMRRChartData() {
      try {
        setIsLoading(true);
        
        // Adicionar timestamp para evitar cache
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/admin/metrics/mrr/history?t=${timestamp}`);
        
        if (!response.ok) {
          throw new Error("Falha ao carregar histórico de MRR");
        }
        
        const result = await response.json();
        console.log("Histórico de MRR carregado:", result);
        
        setData({
          labels: result.labels || [],
          values: result.values || [],
        });
      } catch (error) {
        console.error("Erro ao buscar histórico de MRR:", error);
        toast.error("Erro ao carregar dados de histórico de MRR");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMRRChartData();
  }, []);

  if (isLoading || !data) {
    return <Skeleton className="h-[300px]" />;
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "MRR (R$)",
        data: data.values,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              maximumFractionDigits: 0,
            }).format(value);
          }
        }
      },
    },
  };

  return (
    <div className="h-[300px]">
      <Line data={chartData} options={options} />
    </div>
  );
}
