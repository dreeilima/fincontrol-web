import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { SettingsTabs } from "@/components/settings/settings-tabs";

export const metadata = constructMetadata({
  title: "Configurações – FinControl",
  description: "Gerencie suas configurações e preferências.",
});

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <DashboardHeader />
        <SettingsTabs user={session.user as any} />
      </div>
    </DashboardShell>
  );
}
