import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { AdminDashboard } from "@/components/admin/dashboard";
import { DashboardHeader } from "@/components/dashboard/header";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between"></div>
      <AdminDashboard />
    </div>
  );
}
