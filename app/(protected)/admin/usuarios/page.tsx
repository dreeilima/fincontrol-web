import { db } from "@/lib/db";
import { User, UsersTable } from "@/components/admin/users-table";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";

export const metadata = {
  title: "Usuários – FinControl",
  description: "Gerenciamento de usuários do sistema.",
};

export default async function UsersPage() {
  const users = await db.user
    .findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            transactions: true,
            categories: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    .then((users) =>
      users.map((user) => ({
        ...user,
        plan: "PRO", // Plano padrão para todos os usuários
      })),
    );

  return (
    <DashboardShell>
      <DashboardHeader />
      <div className="grid gap-4 sm:gap-6">
        <UsersTable data={users} />
      </div>
    </DashboardShell>
  );
}
