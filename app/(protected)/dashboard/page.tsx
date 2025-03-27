import { constructMetadata } from "@/lib/utils";
import { DashboardDateFilter } from "@/components/dashboard/date-filter";
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
        <DashboardDateFilter />
        <DashboardMetrics />
        <DashboardWidgets />
      </div>
    </DashboardShell>
  );
}
