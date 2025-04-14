import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";

export default function UsersLoading() {
  return (
    <DashboardShell>
      <DashboardHeader />
      <div className="grid gap-4 sm:gap-6">
        <Skeleton className="h-[52px] rounded-lg" />
        <Skeleton className="h-[450px] rounded-lg" />
      </div>
    </DashboardShell>
  );
}
