import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLoading() {
  return (
    <>
      <DashboardHeader heading="Dashboard" description="Carregando..." />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}
