import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { BillingForm } from "@/components/billing/billing-form";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";

export const metadata = constructMetadata({
  title: "Assinatura – FinControl",
  description: "Gerencie sua assinatura e plano.",
});

export default async function BillingPage() {
  const user = await getCurrentUser();

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <DashboardHeader />
        <BillingForm
          subscriptionPlan={{
            ...user,
            stripeCustomerId: user?.stripeCustomerId ?? null,
            stripeSubscriptionId: user?.stripeSubscriptionId ?? null,
            stripePriceId: user?.stripePriceId ?? null,
            stripeCurrentPeriodEnd: user?.stripeCurrentPeriodEnd ?? null,
          }}
        />
      </div>
    </DashboardShell>
  );
}
