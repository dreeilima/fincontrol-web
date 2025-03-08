import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardMetrics } from "@/components/dashboard/metrics";
import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardWidgets } from "@/components/dashboard/widgets";

export const metadata = constructMetadata({
  title: "Dashboard – FinControl",
  description: "Controle de finanças pessoais.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <DashboardHeader />
        <DashboardMetrics />
        <DashboardWidgets />
      </div>
    </DashboardShell>
  );
}
