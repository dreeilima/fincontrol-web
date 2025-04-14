import { db } from "@/lib/db";
import { User, UsersTable } from "@/components/admin/users-table";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";

export const metadata = {
  title: "Usuários – FinControl",
  description: "Gerenciamento de usuários do sistema.",
};

export default async function UsersPage() {
  const users = await db.users
    .findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
        _count: {
          select: {
            transactions: true,
            categories: true,
          },
        },
        subscription: {
          select: {
            plan: true,
            status: true,
            stripe_current_period_end: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    })
    .then((users) =>
      users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.is_active,
        createdAt: user.created_at,
        plan: user.subscription?.plan?.toUpperCase() || "FREE",
        subscriptionStatus: user.subscription?.status || "inactive",
        subscriptionEnd: user.subscription?.stripe_current_period_end,
        _count: user._count,
      })),
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
