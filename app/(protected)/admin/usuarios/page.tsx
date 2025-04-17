import { db } from "@/lib/db";
import { User, UsersTable } from "@/components/admin/users-table";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";

export const metadata = {
  title: "Usuários – FinControl",
  description: "Gerenciamento de usuários do sistema.",
};

export default async function UsersPage() {
  // Buscar todos os usuários do banco de dados com dados reais
  const users = await db.users
    .findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
        stripe_price_id: true,
        stripe_subscription_id: true,
        stripe_current_period_end: true,
        _count: {
          select: {
            transactions: true,
            categories: true,
          },
        },
        active_subscription: {
          select: {
            status: true,
            stripe_current_period_end: true,
            plan: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    })
    .then((users) =>
      // Mapear os dados para o formato esperado pelo componente UsersTable
      users.map((user) => {
        // Determinar o plano com base nos dados reais
        let plan = "FREE";
        if (user.stripe_price_id) {
          if (
            user.stripe_price_id ===
            process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID
          ) {
            plan = "PRO";
          } else if (
            user.stripe_price_id ===
            process.env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID
          ) {
            plan = "BUSINESS";
          }
        }

        // Determinar o status da assinatura com base nos dados reais
        const subscriptionStatus =
          user.stripe_subscription_id &&
          user.stripe_current_period_end &&
          new Date(user.stripe_current_period_end) > new Date()
            ? "active"
            : "inactive";

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.is_active,
          createdAt: user.created_at,
          plan: user.active_subscription?.plan?.name?.toUpperCase() || plan,
          subscriptionStatus:
            user.active_subscription?.status || subscriptionStatus,
          subscriptionEnd:
            user.active_subscription?.stripe_current_period_end ||
            user.stripe_current_period_end,
          _count: user._count,
        };
      }),
    );

  return (
    <DashboardShell>
      <DashboardHeader />
      <div className="grid gap-4 sm:gap-6">
        <UsersTable data={users as User[]} />
      </div>
    </DashboardShell>
  );
}
