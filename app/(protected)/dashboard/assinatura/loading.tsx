import { BillingFormSkeleton } from "@/components/billing/billing-form-skeleton";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";

export default function BillingLoading() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <DashboardHeader />
        <BillingFormSkeleton />
      </div>
    </DashboardShell>
  );
}
