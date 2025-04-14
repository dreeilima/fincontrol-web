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
import { FinancialForecast } from "@/components/reports/financial-forecast";
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

        <Suspense fallback={<Skeleton className="h-[160px] w-full" />}>
          <ReportSummary />
        </Suspense>

        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
            <TabsTrigger value="trends">Evolução Mensal</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="forecast">Previsão</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Evolução Mensal</CardTitle>
                <CardDescription>
                  Acompanhe suas receitas, despesas e saldo ao longo dos meses
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <Suspense fallback={<Skeleton className="size-full" />}>
                  <MonthlyTrendsChart />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gastos por Categoria</CardTitle>
                <CardDescription>
                  Analise como seus gastos estão distribuídos entre as
                  categorias
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <Suspense fallback={<Skeleton className="size-full" />}>
                  <ExpensesByCategoryChart />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecast" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Previsão Financeira</CardTitle>
                <CardDescription>
                  Visualize a projeção de suas finanças para os próximos meses
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <Suspense fallback={<Skeleton className="size-full" />}>
                  <FinancialForecast />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
