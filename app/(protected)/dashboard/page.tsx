import { Suspense } from "react";

import { constructMetadata } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { BudgetProgress } from "@/components/dashboard/budget-progress";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardMetrics } from "@/components/dashboard/metrics";
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

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
              <BudgetProgress />
            </Suspense>
          </div>
          <div className="md:col-span-2">
            <DashboardWidgets />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
