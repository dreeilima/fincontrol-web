import { SystemSettings } from "@/components/admin/system-settings-new";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";

export const metadata = {
  title: "Configurações – FinControl",
  description: "Configurações do sistema.",
};

export default async function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Configurações do Sistema"
        text="Gerencie as configurações globais do FinControl"
      />
      <div className="grid gap-4 sm:gap-6">
        <SystemSettings />
      </div>
    </DashboardShell>
  );
}
