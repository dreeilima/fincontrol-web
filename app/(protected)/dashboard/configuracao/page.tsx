import { User } from "next-auth";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { UserSettings } from "@/components/settings/user-settings";

export const metadata = constructMetadata({
  title: "Configurações – FinControl",
  description: "Gerencie suas configurações e preferências.",
});

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <DashboardHeader />
        <UserSettings user={user as User} />
      </div>
    </DashboardShell>
  );
}
