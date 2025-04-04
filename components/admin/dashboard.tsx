"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertCircle,
  LucideIcon,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DefaultCategories } from "./default-categories";
import { FinancialMetrics } from "./metrics/financial-metrics";
import { GrowthMetrics } from "./metrics/growth-metrics";
import { TopUsersTable } from "./top-users-table";

interface Metrics {
  totalUsers: number;
  newUsersThisMonth: number;
  transactionsToday: number;
  userGrowth: string;
  activeSubscriptions: number;
  totalRevenue: number;
  comparisons: {
    users: number;
    transactions: number;
    growth: number;
    revenue: number;
    subscriptions: number;
  };
}

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/admin/metrics");
        if (!response.ok) {
          throw new Error("Erro ao carregar métricas");
        }
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error(error);
        setError("Não foi possível carregar as métricas do sistema");
        toast.error("Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            Olá, {session?.data?.user?.name} 👋
          </h2>
          <p className="text-sm text-muted-foreground">
            Bem-vindo ao painel administrativo
          </p>
        </div>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview" className="space-y-8">
        {/* Seção de Métricas Principais */}
        <section>
          <h3 className="mb-4 text-lg font-medium">Métricas Principais</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[120px] rounded-lg" />
              ))
            ) : (
              <>
                <QuickStatCard
                  title="Total de Usuários"
                  value={metrics?.totalUsers?.toString() ?? "0"}
                  change={metrics?.comparisons?.users ?? 0}
                  changeLabel="em relação ao mês anterior"
                  icon={Users}
                />
                <QuickStatCard
                  title="Transações Hoje"
                  value={metrics?.transactionsToday?.toString() ?? "0"}
                  change={metrics?.comparisons?.transactions ?? 0}
                  changeLabel="em relação a ontem"
                  icon={Activity}
                />
                <QuickStatCard
                  title="Assinaturas Ativas"
                  value={metrics?.activeSubscriptions?.toString() ?? "0"}
                  change={metrics?.comparisons?.subscriptions ?? 0}
                  changeLabel="em relação ao mês anterior"
                  icon={Wallet}
                />
                <QuickStatCard
                  title="Receita Total"
                  value={`R$ ${(metrics?.totalRevenue ?? 0).toLocaleString()}`}
                  change={metrics?.comparisons?.revenue ?? 0}
                  changeLabel="em relação ao mês anterior"
                  icon={TrendingUp}
                />
              </>
            )}
          </div>
        </section>

        {/* Seção de Análise de Crescimento */}
        <section>
          <h3 className="mb-4 text-lg font-medium">Análise de Crescimento</h3>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border bg-card p-4">
              <div className="mb-2">
                <h4 className="text-sm font-medium">Crescimento de Usuários</h4>
              </div>
              <GrowthMetrics />
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="mb-2">
                <h4 className="text-sm font-medium">Métricas Financeiras</h4>
              </div>
              <FinancialMetrics />
            </div>
          </div>
        </section>

        {/* Seção de Usuários Ativos */}
        <section>
          <h3 className="mb-4 text-lg font-medium">Usuários Ativos</h3>
          <div className="rounded-lg border p-6">
            <TopUsersTable />
          </div>
        </section>
      </TabsContent>

      <TabsContent value="categories">
        <div className="rounded-lg border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">Categorias Padrão</h3>
            <p className="text-sm text-muted-foreground">
              Gerencie as categorias padrão disponíveis para todos os usuários
            </p>
          </div>
          <DefaultCategories />
        </div>
      </TabsContent>
    </Tabs>
  );
}

interface QuickStatCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: LucideIcon;
}

function QuickStatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
}: QuickStatCardProps) {
  return (
    <div className="rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="rounded-full border p-2">
          <Icon className="size-5" />
        </div>
      </div>
      <div className="mt-4">
        <p
          className={cn(
            "text-xs",
            change > 0
              ? "text-green-500"
              : change < 0
                ? "text-red-500"
                : "text-muted-foreground",
          )}
        >
          {change > 0 ? "+" : ""}
          {change}% {changeLabel}
        </p>
      </div>
    </div>
  );
}
