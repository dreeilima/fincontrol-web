import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { AdminDashboard } from "@/components/admin/dashboard";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Admin</h2>
      </div>
      <AdminDashboard />
    </div>
  );
}
