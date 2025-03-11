"use client";

import { useState } from "react";
import { SubscriptionPlan, UserSubscriptionPlan } from "@/types";
import { toast } from "sonner";

import { getStripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

interface BillingFormButtonProps {
  year: boolean;
  offer: SubscriptionPlan;
  subscriptionPlan: UserSubscriptionPlan;
}

export function BillingFormButton({
  year,
  offer,
  subscriptionPlan,
}: BillingFormButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: year
            ? offer.priceId.production.yearly
            : offer.priceId.production.monthly,
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await getStripe();
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result?.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      toast.error("Erro ao processar pagamento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSubmit}
      className="w-full bg-green-500 hover:bg-green-600"
      disabled={isLoading}
      rounded="full"
    >
      {isLoading && <Icons.spinner className="mr-2 size-4 animate-spin" />}
      {subscriptionPlan?.stripePriceId ===
      offer.priceId.production[year ? "yearly" : "monthly"]
        ? "Gerenciar assinatura"
        : "Atualizar plano"}
    </Button>
  );
}
