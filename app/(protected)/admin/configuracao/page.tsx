import { SystemSettings } from "@/components/admin/system-settings";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";

export const metadata = {
  title: "Configurações – FinControl",
  description: "Configurações do sistema.",
};

export default async function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader />
      <div className="grid gap-4 sm:gap-6">
        <SystemSettings />
      </div>
    </DashboardShell>
  );
}
