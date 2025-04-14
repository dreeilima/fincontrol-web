import { Suspense } from "react";
import { TransactionsProvider } from "@/contexts/transactions-context";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
import { CategoriesList } from "@/components/categories/categories-list";
import { CategoryForm } from "@/components/categories/category-form";
import { FinancialSummary } from "@/components/dashboard/financial-summary";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { CashFlowAnalysis } from "@/components/transactions/cash-flow-analysis";
import { SpendingPatterns } from "@/components/transactions/spending-patterns";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionsFilter } from "@/components/transactions/transactions-filter";
import { TransactionsList } from "@/components/transactions/transactions-list";

export const metadata = constructMetadata({
  title: "Finanças – FinControl",
  description: "Gerencie suas transações e categorias financeiras.",
});

export default function FinancasPage() {
  const currentDate = format(new Date(), "MMMM 'de' yyyy", { locale: ptBR });

  return (
    <DashboardShell>
      <TransactionsProvider>
        <div className="flex flex-col gap-6">
          <DashboardHeader />

          <Suspense fallback={<Skeleton className="h-[120px] w-full" />}>
            <FinancialSummary />
          </Suspense>

          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
              <TabsTrigger value="transactions">Transações</TabsTrigger>
              <TabsTrigger value="analysis">Análises</TabsTrigger>
              <TabsTrigger value="categories">Categorias</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="mt-4 space-y-4">
              <TransactionsFilter />

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Nova Transação</CardTitle>
                    <CardDescription>
                      Registre uma nova receita ou despesa
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Suspense
                      fallback={<Skeleton className="h-[200px] w-full" />}
                    >
                      <TransactionForm />
                    </Suspense>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle>Últimas Transações</CardTitle>
                    <CardDescription>
                      Visualize e gerencie suas transações recentes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Suspense
                      fallback={<Skeleton className="h-[400px] w-full" />}
                    >
                      <TransactionsList />
                    </Suspense>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="mt-4 space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                  <CashFlowAnalysis />
                </Suspense>
                <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                  <SpendingPatterns />
                </Suspense>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="mt-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Nova Categoria</CardTitle>
                    <CardDescription>
                      Crie uma nova categoria para organizar suas finanças
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Suspense
                      fallback={<Skeleton className="h-[200px] w-full" />}
                    >
                      <CategoryForm />
                    </Suspense>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle>Suas Categorias</CardTitle>
                    <CardDescription>
                      Gerencie suas categorias de receitas e despesas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Suspense
                      fallback={<Skeleton className="h-[400px] w-full" />}
                    >
                      <CategoriesList />
                    </Suspense>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </TransactionsProvider>
    </DashboardShell>
  );
}
