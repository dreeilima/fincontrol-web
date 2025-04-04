import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { db } from "@/lib/db";
import { UsersTable } from "@/components/admin/users-table";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";

export const metadata = {
  title: "Usuários – FinControl",
  description: "Gerenciamento de usuários do sistema.",
};

export default async function UsersPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  const users = await db.users.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      is_active: true,
      created_at: true,
      subscription: {
        select: {
          plan: true,
          status: true,
        },
      },
      _count: {
        select: {
          transactions: true,
          categories: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const formattedUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.is_active,
    createdAt: user.created_at,
    plan: user.subscription?.plan || "basic",
    status: user.subscription?.status || "inactive",
    _count: user._count,
  }));

  return (
    <DashboardShell>
      <DashboardHeader />
      <div className="grid gap-4 sm:gap-6">
        <UsersTable data={formattedUsers} />
      </div>
    </DashboardShell>
  );
}
