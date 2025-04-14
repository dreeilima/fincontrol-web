"use client";

import { useEffect, useState } from "react";
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { toast } from "sonner";
import * as XLSX from "xlsx";

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

interface ReportsData {
  labels: string[];
  datasets: {
    revenue: number[];
    costs: number[];
    users: number[];
    conversions: number[];
  };
}

interface OverviewData {
  revenue: {
    total: number;
    growth: number;
    monthly: number[];
  };
  users: {
    total: number;
    growth: number;
    monthly: number[];
  };
  plans: {
    basic: number;
    pro: number;
  };
  months: string[];
}

interface YearData {
  year: number;
  reportsData: ReportsData;
  overviewData: OverviewData;
}

const MONTHS = [
  { value: "1", label: "Janeiro" },
  { value: "2", label: "Fevereiro" },
  { value: "3", label: "Março" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Maio" },
  { value: "6", label: "Junho" },
  { value: "7", label: "Julho" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

export function AdminReports() {
  const [selectedMonth, setSelectedMonth] = useState(
    (new Date().getMonth() + 1).toString(),
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  );
  const [monthData, setMonthData] = useState<Record<string, YearData>>({});
  const [isLoading, setIsLoading] = useState(true);

  const monthKey = `${selectedYear}-${selectedMonth}`;

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        // Verifica se já temos os dados do mês selecionado em cache
        if (monthData[monthKey]) {
          setIsLoading(false);
          return;
        }

        const [reportsResponse, overviewResponse] = await Promise.all([
          fetch(
            `/api/admin/reports?year=${selectedYear}&month=${selectedMonth}`,
          ),
          fetch(
            `/api/admin/metrics/overview?year=${selectedYear}&month=${selectedMonth}`,
          ),
        ]);

        if (!reportsResponse.ok || !overviewResponse.ok) {
          throw new Error("Falha ao carregar dados");
        }

        const [reportsData, overviewData] = await Promise.all([
          reportsResponse.json(),
          overviewResponse.json(),
        ]);

        setMonthData((prev) => ({
          ...prev,
          [monthKey]: {
            year: Number(selectedYear),
            reportsData,
            overviewData,
          },
        }));
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [selectedYear, selectedMonth, monthKey, monthData]);

  const currentMonthData = monthData[monthKey];

  const handleExport = async () => {
    try {
      if (!currentMonthData) return;

      // Preparar dados para as planilhas
      const worksheets = {
        Resumo: [
          ["Relatório Financeiro", ""],
          [
            "Período",
            `${MONTHS[Number(selectedMonth) - 1].label}/${selectedYear}`,
          ],
          ["Gerado em", format(new Date(), "dd/MM/yyyy HH:mm")],
          [""],
          ["Métricas Principais", ""],
          [
            "Receita Total",
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(currentMonthData.overviewData.revenue.total),
          ],
          [
            "Crescimento da Receita",
            `${currentMonthData.overviewData.revenue.growth.toFixed(1)}%`,
          ],
          ["Total de Usuários", currentMonthData.overviewData.users.total],
          [
            "Crescimento de Usuários",
            `${currentMonthData.overviewData.users.growth.toFixed(1)}%`,
          ],
        ],
        "Receitas e Custos": [
          ["Data", "Receita", "Custos", "Resultado"],
          ...currentMonthData.reportsData.labels.map((label, index) => [
            label,
            currentMonthData.reportsData.datasets.revenue[index],
            currentMonthData.reportsData.datasets.costs[index],
            currentMonthData.reportsData.datasets.revenue[index] -
              currentMonthData.reportsData.datasets.costs[index],
          ]),
        ],
        Usuários: [
          ["Data", "Novos Usuários", "Taxa de Conversão (%)"],
          ...currentMonthData.reportsData.labels.map((label, index) => [
            label,
            currentMonthData.reportsData.datasets.users[index],
            currentMonthData.reportsData.datasets.conversions[index].toFixed(1),
          ]),
        ],
        "Distribuição de Planos": [
          ["Plano", "Quantidade de Usuários"],
          ["Basic", currentMonthData.overviewData.plans.basic],
          ["Pro", currentMonthData.overviewData.plans.pro],
          [
            "Total",
            currentMonthData.overviewData.plans.basic +
              currentMonthData.overviewData.plans.pro,
          ],
        ],
      };

      // Criar workbook
      const wb = XLSX.utils.book_new();

      // Adicionar cada planilha ao workbook
      Object.entries(worksheets).forEach(([sheetName, data]) => {
        const ws = XLSX.utils.aoa_to_sheet(data);

        // Configurar largura das colunas
        const colWidths = data[0].map((_, i) => ({
          wch: Math.max(...data.map((row) => row[i]?.toString().length || 10)),
        }));
        ws["!cols"] = colWidths;

        // Estilizar células de cabeçalho
        const headerStyle = {
          font: { bold: true },
          fill: { fgColor: { rgb: "EFEFEF" } },
        };

        // Aplicar estilos ao cabeçalho
        const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const addr = XLSX.utils.encode_cell({ r: 0, c: C });
          if (!ws[addr]) continue;
          ws[addr].s = headerStyle;
        }

        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });

      // Gerar arquivo e fazer download
      XLSX.writeFile(
        wb,
        `relatorio-fincontrol-${MONTHS[Number(selectedMonth) - 1].label}-${selectedYear}.xlsx`,
      );

      toast.success("Relatório exportado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao exportar relatório");
    }
  };

  if (isLoading || !currentMonthData) {
    return <div className="h-[400px] animate-pulse rounded-md bg-muted" />;
  }

  // Gerar array de anos disponíveis (últimos 5 anos)
  const availableYears = Array.from({ length: 5 }, (_, i) =>
    (new Date().getFullYear() - i).toString(),
  );

  return (
    <div className="grid gap-4 sm:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <CalendarIcon className="mr-2 size-4" />
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleExport}>
          Exportar Relatório {MONTHS[Number(selectedMonth) - 1].label}/
          {selectedYear}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(currentMonthData.overviewData.revenue.total)}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentMonthData.overviewData.revenue.growth > 0 ? "+" : ""}
              {currentMonthData.overviewData.revenue.growth.toFixed(1)}% em
              relação ao mês anterior
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
                  labels: currentMonthData.overviewData.months,
                  datasets: [
                    {
                      data: currentMonthData.overviewData.revenue.monthly,
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
            <div className="text-2xl font-bold">
              {currentMonthData.overviewData.users.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentMonthData.overviewData.users.growth > 0 ? "+" : ""}
              {currentMonthData.overviewData.users.growth.toFixed(1)}% em
              relação ao mês anterior
            </p>
            <div className="mt-4 h-[200px]">
              <Bar
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } },
                }}
                data={{
                  labels: currentMonthData.overviewData.months,
                  datasets: [
                    {
                      data: currentMonthData.overviewData.users.monthly,
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
                      data: [
                        currentMonthData.overviewData.plans.basic,
                        currentMonthData.overviewData.plans.pro,
                      ],
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
                  labels: currentMonthData.reportsData.labels,
                  datasets: [
                    {
                      label: "Receita Total",
                      data: currentMonthData.reportsData.datasets.revenue,
                      borderColor: "rgb(34, 197, 94)",
                      backgroundColor: "rgba(34, 197, 94, 0.5)",
                      tension: 0.3,
                    },
                    {
                      label: "Custos",
                      data: currentMonthData.reportsData.datasets.costs,
                      borderColor: "rgb(239, 68, 68)",
                      backgroundColor: "rgba(239, 68, 68, 0.5)",
                      tension: 0.3,
                    },
                  ],
                }}
              />
            </TabsContent>

            <TabsContent value="users" className="h-[400px]">
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
                  labels: currentMonthData.reportsData.labels,
                  datasets: [
                    {
                      label: "Novos Usuários",
                      data: currentMonthData.reportsData.datasets.users,
                      borderColor: "rgb(59, 130, 246)",
                      backgroundColor: "rgba(59, 130, 246, 0.5)",
                      tension: 0.3,
                    },
                  ],
                }}
              />
            </TabsContent>

            <TabsContent value="conversion" className="h-[400px]">
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
                      max: 100,
                    },
                  },
                }}
                data={{
                  labels: currentMonthData.reportsData.labels,
                  datasets: [
                    {
                      label: "Taxa de Conversão (%)",
                      data: currentMonthData.reportsData.datasets.conversions,
                      borderColor: "rgb(139, 92, 246)",
                      backgroundColor: "rgba(139, 92, 246, 0.5)",
                      tension: 0.3,
                    },
                  ],
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
