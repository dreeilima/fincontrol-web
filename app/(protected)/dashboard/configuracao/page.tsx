import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { db } from "@/lib/db";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import { UserDataRefresh } from "@/components/shared/user-data-refresh";

export const metadata = constructMetadata({
  title: "Configurações – FinControl",
  description: "Gerencie suas configurações e preferências.",
});

// Esta função força o Next.js a revalidar esta página a cada requisição
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Buscar os dados mais atualizados diretamente do banco de dados
  const dbUser = await db.users.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      stripe_customer_id: true,
      stripe_subscription_id: true,
      stripe_price_id: true,
      stripe_current_period_end: true,
    },
  });

  // Usar os dados do banco de dados ou da sessão como fallback
  const userData = dbUser || session.user;
  console.log("Dados do usuário na página de configurações:", userData);

  return (
    <DashboardShell>
      <UserDataRefresh autoRefresh={true}>
        <div className="flex flex-col gap-6">
          <DashboardHeader />
          <SettingsTabs user={userData as any} />
        </div>
      </UserDataRefresh>
    </DashboardShell>
  );
}
