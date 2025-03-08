"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DefaultCategories } from "./default-categories";
import { FinancialMetrics } from "./metrics/financial-metrics";
import { GrowthMetrics } from "./metrics/growth-metrics";
import { UsageMetrics } from "./metrics/usage-metrics";
import { SystemMetrics } from "./system-metrics";
import { TopUsersTable } from "./top-users-table";
import { UserList } from "./user-list";

export function AdminDashboard() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="users">Usuários</TabsTrigger>
        <TabsTrigger value="categories">Categorias Padrão</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <GrowthMetrics />
        <FinancialMetrics />
        <UsageMetrics />
        <SystemMetrics />
      </TabsContent>

      <TabsContent value="users" className="space-y-4">
        <UserList />
      </TabsContent>

      <TabsContent value="categories" className="space-y-4">
        <DefaultCategories />
      </TabsContent>
    </Tabs>
  );
}
