"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  LucideIcon,
  Settings,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useSession } from "next-auth/react";

import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DefaultCategories } from "./default-categories";
import { FinancialMetrics } from "./metrics/financial-metrics";
import { GrowthMetrics } from "./metrics/growth-metrics";
import { UsageMetrics } from "./metrics/usage-metrics";
import { SystemMetrics } from "./system-metrics";
import { TopUsersTable } from "./top-users-table";
import { UserList } from "./user-list";

interface Metrics {
  totalUsers: number;
  newUsersThisMonth: number;
  transactionsToday: number;
  userGrowth: string;
  comparisons: {
    users: number;
    transactions: number;
    growth: number;
  };
}

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const session = useSession();

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch("/api/admin/metrics");
        if (!response.ok) throw new Error();
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMetrics();
  }, []);

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">
          Olá, {session?.data?.user?.name} 👋
        </h2>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview" className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6">
          <QuickStatCard
            title="Total de Usuários"
            value={metrics?.totalUsers.toString() || "0"}
            change={metrics?.comparisons?.users || 0}
            changeLabel="em relação ao mês anterior"
            icon={Users}
          />
          <QuickStatCard
            title="Transações Hoje"
            value={metrics?.transactionsToday.toString() || "0"}
            change={metrics?.comparisons?.transactions || 0}
            changeLabel="em relação a ontem"
            icon={Activity}
          />
          <QuickStatCard
            title="Crescimento"
            value={`${metrics?.userGrowth || 0}%`}
            change={metrics?.comparisons?.growth || 0}
            changeLabel="em relação ao mês anterior"
            icon={TrendingUp}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-lg border p-6">
            <GrowthMetrics />
          </div>
          <div className="rounded-lg border p-6">
            <FinancialMetrics />
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-lg border p-6">
            <UsageMetrics />
          </div>
          <div className="rounded-lg border p-6">
            <SystemMetrics />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="users">
        <div className="rounded-lg border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">Gerenciamento de Usuários</h3>
            <p className="text-sm text-muted-foreground">
              Gerencie todos os usuários da plataforma
            </p>
          </div>
          <UserList />
        </div>
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
