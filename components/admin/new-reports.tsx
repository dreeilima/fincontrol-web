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
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, DownloadIcon, RefreshCw } from "lucide-react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { toast } from "sonner";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Registrar componentes do Chart.js
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

// Tipos para os dados de relatórios
interface FinancialMetrics {
  mrr: number;
  mrrGrowth: number;
  totalRevenue: number;
  revenueGrowth: number;
  avgRevenuePerUser: number;
  conversionRate: number;
  monthlyData: {
    month: string;
    revenue: number;
    newUsers: number;
    churnRate: number;
  }[];
}

interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  userGrowth: number;
  avgTransactionsPerUser: number;
  avgCategoriesPerUser: number;
  retentionRate: number;
  planDistribution: {
    basic: number;
    premium: number;
  };
}

interface ReportData {
  financial: FinancialMetrics;
  users: UserMetrics;
  dateRange: {
    from: string;
    to: string;
  };
}

export function AdminReports() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [dateRange, setDateRange] = useState({
    from: subMonths(new Date(), 3),
    to: new Date(),
  });

  // Função para carregar os dados do relatório
  const loadReportData = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      // Formatar datas para a API
      const from = dateRange.from.toISOString();
      const to = dateRange.to.toISOString();

      // Adicionar timestamp para evitar cache
      const timestamp = new Date().getTime();

      // Buscar dados da API
      const response = await fetch(
        `/api/admin/reports/dashboard?from=${from}&to=${to}&t=${timestamp}`,
      );

      if (!response.ok) {
        throw new Error("Falha ao carregar dados");
      }

      const data = await response.json();
      setReportData(data);

      if (refresh) {
        toast.success("Dados atualizados com sucesso");
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados. Tente novamente.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Carregar dados quando o componente montar ou quando o período mudar
  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  // Função para exportar relatório
  const handleExportReport = () => {
    if (!reportData) return;

    toast.success("Exportação iniciada. O download começará em instantes.");

    try {
      // Preparar dados para as planilhas
      const worksheets = {
        "Resumo Financeiro": [
          ["Relatório Financeiro - FinControl", ""],
          [
            "Período",
            `${new Date(reportData.dateRange.from).toLocaleDateString("pt-BR")} até ${new Date(reportData.dateRange.to).toLocaleDateString("pt-BR")}`,
          ],
          ["Gerado em", format(new Date(), "dd/MM/yyyy HH:mm")],
          [""],
          ["Métricas Principais", ""],
          [
            "Receita Total",
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(reportData.financial.totalRevenue),
          ],
          ["Crescimento da Receita", `${reportData.financial.revenueGrowth}%`],
          [
            "MRR (Receita Mensal Recorrente)",
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(reportData.financial.mrr),
          ],
          ["Crescimento do MRR", `${reportData.financial.mrrGrowth}%`],
          [
            "Receita Média por Usuário",
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(reportData.financial.avgRevenuePerUser),
          ],
          ["Taxa de Conversão", `${reportData.financial.conversionRate}%`],
          [""],
          ["Métricas de Usuários", ""],
          ["Total de Usuários", reportData.users.totalUsers],
          ["Usuários Ativos", reportData.users.activeUsers],
          ["Crescimento de Usuários", `${reportData.users.userGrowth}%`],
          ["Taxa de Retenção", `${reportData.users.retentionRate}%`],
          [
            "Média de Transações por Usuário",
            reportData.users.avgTransactionsPerUser,
          ],
          [
            "Média de Categorias por Usuário",
            reportData.users.avgCategoriesPerUser,
          ],
          [""],
          ["Distribuição de Planos", ""],
          ["Plano Básico", reportData.users.planDistribution.basic],
          ["Plano Premium", reportData.users.planDistribution.premium],
        ],
        "Dados Mensais": [
          ["Mês", "Receita", "Novos Usuários", "Taxa de Churn (%)"],
          ...reportData.financial.monthlyData.map((month) => [
            month.month,
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(month.revenue),
            month.newUsers,
            `${month.churnRate}%`,
          ]),
        ],
      };

      // Criar workbook
      const wb = XLSX.utils.book_new();

      // Adicionar cada planilha ao workbook
      Object.entries(worksheets).forEach(([sheetName, data]) => {
        const ws = XLSX.utils.aoa_to_sheet(data);

        // Configurar largura das colunas
        const colWidths = data[0].map((_, i) => ({
          wch: Math.max(...data.map((row) => String(row[i] || "").length)) + 2,
        }));
        ws["!cols"] = colWidths;

        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });

      // Gerar arquivo e fazer download
      const fileName = `fincontrol-relatorio-${format(new Date(), "yyyy-MM-dd")}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.success("Relatório exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar relatório:", error);
      toast.error("Erro ao exportar relatório. Tente novamente.");
    }
  };

  // Renderizar esqueleto de carregamento
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[200px]" />
        <Skeleton className="col-span-full h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho com filtros e ações */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Relatórios Administrativos
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />

          <Button
            variant="outline"
            size="icon"
            onClick={() => loadReportData(true)}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>

          <Button onClick={handleExportReport}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Conteúdo principal do relatório */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Métricas financeiras */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Receita Mensal Recorrente (MRR)</CardTitle>
            <CardDescription>
              Receita recorrente mensal das assinaturas ativas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(reportData?.financial.mrr || 0)}
            </div>
            <p
              className={`text-xs ${reportData?.financial.mrrGrowth && reportData.financial.mrrGrowth > 0 ? "text-green-500" : "text-red-500"}`}
            >
              {reportData?.financial.mrrGrowth &&
              reportData.financial.mrrGrowth > 0
                ? "+"
                : ""}
              {reportData?.financial.mrrGrowth}% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Taxa de Conversão</CardTitle>
            <CardDescription>
              Percentual de usuários no plano premium
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData?.financial.conversionRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {reportData?.users.planDistribution.premium} de{" "}
              {reportData?.users.totalUsers} usuários
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Receita por Usuário</CardTitle>
            <CardDescription>
              Valor médio gerado por usuário ativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(reportData?.financial.avgRevenuePerUser || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Baseado em {reportData?.users.activeUsers} usuários ativos
            </p>
          </CardContent>
        </Card>

        {/* Métricas de usuários */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Usuários Ativos</CardTitle>
            <CardDescription>
              Total de usuários ativos na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData?.users.activeUsers}
            </div>
            <p
              className={`text-xs ${reportData?.users.userGrowth && reportData.users.userGrowth > 0 ? "text-green-500" : "text-red-500"}`}
            >
              {reportData?.users.userGrowth && reportData.users.userGrowth > 0
                ? "+"
                : ""}
              {reportData?.users.userGrowth}% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Taxa de Retenção</CardTitle>
            <CardDescription>
              Percentual de usuários que permanecem ativos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData?.users.retentionRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {reportData?.users.activeUsers} de {reportData?.users.totalUsers}{" "}
              usuários
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Engajamento</CardTitle>
            <CardDescription>
              Média de transações e categorias por usuário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <div className="text-sm font-medium">Transações</div>
                <div className="text-xl font-bold">
                  {reportData?.users.avgTransactionsPerUser}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Categorias</div>
                <div className="text-xl font-bold">
                  {reportData?.users.avgCategoriesPerUser}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos detalhados */}
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Evolução Financeira</CardTitle>
            <CardDescription>
              Acompanhamento da receita mensal no período selecionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="revenue" className="space-y-4">
              <TabsList>
                <TabsTrigger value="revenue">Receita</TabsTrigger>
                <TabsTrigger value="users">Usuários</TabsTrigger>
                <TabsTrigger value="churn">Churn</TabsTrigger>
              </TabsList>

              <TabsContent value="revenue" className="h-[400px]">
                <Line
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
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
                          },
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function (value) {
                            return new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                              notation: "compact",
                              compactDisplay: "short",
                            }).format(value);
                          },
                        },
                      },
                    },
                  }}
                  data={{
                    labels:
                      reportData?.financial.monthlyData.map((d) => d.month) ||
                      [],
                    datasets: [
                      {
                        label: "Receita Total",
                        data:
                          reportData?.financial.monthlyData.map(
                            (d) => d.revenue,
                          ) || [],
                        borderColor: "rgb(34, 197, 94)",
                        backgroundColor: "rgba(34, 197, 94, 0.5)",
                        tension: 0.3,
                      },
                    ],
                  }}
                />
              </TabsContent>

              <TabsContent value="users" className="h-[400px]">
                <Bar
                  options={{
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
                  }}
                  data={{
                    labels:
                      reportData?.financial.monthlyData.map((d) => d.month) ||
                      [],
                    datasets: [
                      {
                        label: "Novos Usuários",
                        data:
                          reportData?.financial.monthlyData.map(
                            (d) => d.newUsers,
                          ) || [],
                        backgroundColor: "rgba(59, 130, 246, 0.5)",
                        borderColor: "rgb(59, 130, 246)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </TabsContent>

              <TabsContent value="churn" className="h-[400px]">
                <Line
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            let label = context.dataset.label || "";
                            if (label) {
                              label += ": ";
                            }
                            if (context.parsed.y !== null) {
                              label += context.parsed.y + "%";
                            }
                            return label;
                          },
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max:
                          Math.max(
                            ...(reportData?.financial.monthlyData.map(
                              (d) => d.churnRate,
                            ) || [0]),
                          ) * 1.2 || 10,
                        ticks: {
                          callback: function (value) {
                            return value + "%";
                          },
                        },
                      },
                    },
                  }}
                  data={{
                    labels:
                      reportData?.financial.monthlyData.map((d) => d.month) ||
                      [],
                    datasets: [
                      {
                        label: "Taxa de Churn",
                        data:
                          reportData?.financial.monthlyData.map(
                            (d) => d.churnRate,
                          ) || [],
                        borderColor: "rgb(239, 68, 68)",
                        backgroundColor: "rgba(239, 68, 68, 0.5)",
                        tension: 0.3,
                      },
                    ],
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Planos</CardTitle>
              <CardDescription>
                Proporção de usuários em cada plano
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-[300px] w-[300px]">
                <Doughnut
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const label = context.label || "";
                            const value = context.raw;
                            const total = context.dataset.data.reduce(
                              (a: number, b: number) => a + b,
                              0,
                            );
                            const percentage =
                              total > 0 ? Math.round((value / total) * 100) : 0;
                            return `${label}: ${value} (${percentage}%)`;
                          },
                        },
                      },
                    },
                  }}
                  data={{
                    labels: ["Plano Básico", "Plano Premium"],
                    datasets: [
                      {
                        data: [
                          reportData?.users.planDistribution.basic || 0,
                          reportData?.users.planDistribution.premium || 0,
                        ],
                        backgroundColor: [
                          "rgba(59, 130, 246, 0.5)",
                          "rgba(34, 197, 94, 0.5)",
                        ],
                        borderColor: ["rgb(59, 130, 246)", "rgb(34, 197, 94)"],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
              <CardDescription>
                Principais indicadores financeiros do período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Receita Total
                    </p>
                    <p className="text-xl font-bold">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(reportData?.financial.totalRevenue || 0)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Crescimento
                    </p>
                    <p
                      className={`text-xl font-bold ${reportData?.financial.revenueGrowth && reportData.financial.revenueGrowth > 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {reportData?.financial.revenueGrowth &&
                      reportData.financial.revenueGrowth > 0
                        ? "+"
                        : ""}
                      {reportData?.financial.revenueGrowth}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      MRR
                    </p>
                    <p className="text-xl font-bold">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(reportData?.financial.mrr || 0)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Conversão
                    </p>
                    <p className="text-xl font-bold">
                      {reportData?.financial.conversionRate}%
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Período do Relatório
                  </p>
                  <p className="text-base">
                    {reportData?.dateRange ? (
                      <>
                        {new Date(reportData.dateRange.from).toLocaleDateString(
                          "pt-BR",
                        )}{" "}
                        até{" "}
                        {new Date(reportData.dateRange.to).toLocaleDateString(
                          "pt-BR",
                        )}
                      </>
                    ) : (
                      "Período não definido"
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
