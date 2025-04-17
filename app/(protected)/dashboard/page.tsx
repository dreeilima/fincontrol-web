import { Suspense } from "react";

import { constructMetadata } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BudgetProgress } from "@/components/dashboard/budget-progress";
import { DashboardHeader } from "@/components/dashboard/header";
import { LimitsCard } from "@/components/dashboard/limits-card";
import { DashboardMetrics } from "@/components/dashboard/metrics";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardWidgets } from "@/components/dashboard/widgets";

export const metadata = constructMetadata({
  title: "Dashboard – FinControl",
  description: "Controle de finanças pessoais.",
});

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <DashboardHeader />
        <DashboardMetrics />

        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-6">
            <Suspense fallback={<Skeleton className="h-[250px] w-full" />}>
              <BudgetProgress />
            </Suspense>
          </div>

          <div className="md:col-span-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <QuickActions />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Card de Limites do Plano */}
        <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
          <div className="w-full">
            <LimitsCard />
          </div>
        </Suspense>

        <div className="w-full">
          <DashboardWidgets displayQuickActions={false} />
        </div>
      </div>
    </DashboardShell>
  );
}
