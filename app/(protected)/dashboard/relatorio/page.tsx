import { Suspense } from "react";
import { Metadata } from "next";

import { constructMetadata } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { ExpensesByCategoryChart } from "@/components/reports/expenses-by-category-chart";
import { IncomeVsExpensesChart } from "@/components/reports/income-vs-expenses-chart";
import { MonthlyTrendsChart } from "@/components/reports/monthly-trends-chart";
import { ReportFilters } from "@/components/reports/report-filters";
import { ReportSummary } from "@/components/reports/report-summary";

export const metadata = constructMetadata({
  title: "Relatórios – FinControl",
  description: "Visualize e analise seus dados financeiros.",
});

export default function RelatoriosPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <DashboardHeader />

        <ReportFilters />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Suspense fallback={<Skeleton className="h-[120px] w-full" />}>
            <ReportSummary />
          </Suspense>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="trends">Tendências</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Receitas vs Despesas</CardTitle>
                <CardDescription>
                  Comparativo entre suas receitas e despesas no período
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <Suspense fallback={<Skeleton className="size-full" />}>
                  <IncomeVsExpensesChart />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Despesas por Categoria</CardTitle>
                <CardDescription>
                  Distribuição de suas despesas por categoria
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <Suspense fallback={<Skeleton className="size-full" />}>
                  <ExpensesByCategoryChart />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Tendências Mensais</CardTitle>
                <CardDescription>
                  Evolução de suas finanças ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <Suspense fallback={<Skeleton className="size-full" />}>
                  <MonthlyTrendsChart />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
