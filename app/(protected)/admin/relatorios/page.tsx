import { AdminReports } from "@/components/admin/reports";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";

export const metadata = {
  title: "Relatórios – FinControl",
  description: "Relatórios administrativos do sistema.",
};

export default async function ReportsPage() {
  return (
    <DashboardShell>
      <DashboardHeader />
      <div className="grid gap-4 sm:gap-6">
        <AdminReports />
      </div>
    </DashboardShell>
  );
}
