import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { constructMetadata } from "@/lib/utils";
import { BillingForm } from "@/components/billing/billing-form";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";

export const metadata = constructMetadata({
  title: "Assinatura – FinControl",
  description: "Gerencie sua assinatura e plano.",
});

export default async function BillingPage() {
  const session = await auth();

  if (!session?.users) {
    redirect("/login");
  }

  const subscriptionPlan = {
    stripeCustomerId: session.users.stripe_customer_id,
    stripeSubscriptionId: session.users.stripe_subscription_id,
    stripePriceId: session.users.stripe_price_id,
    stripeCurrentPeriodEnd: session.users.stripe_current_period_end,
  };

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <DashboardHeader />
        <BillingForm subscriptionPlan={subscriptionPlan} />
      </div>
    </DashboardShell>
  );
}
