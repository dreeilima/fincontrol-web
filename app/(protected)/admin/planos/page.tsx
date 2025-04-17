import { Plans } from "@/components/admin/plans";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";

export const metadata = {
  title: "Planos e Assinaturas – FinControl",
  description: "Gerenciamento de planos e assinaturas do sistema.",
};

export default async function PlansPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Planos e Assinaturas" />
      <div className="grid gap-4 sm:gap-6">
        <Plans />
      </div>
    </DashboardShell>
  );
}
