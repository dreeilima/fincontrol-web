"use client";

import { useState } from "react";
import { toast } from "sonner";

import { pricingData } from "@/config/subscriptions";
import { getStripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/shared/icons";

interface BillingFormProps {
  subscriptionPlan: {
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    stripePriceId: string | null;
    stripeCurrentPeriodEnd: Date | null;
  };
}

export function BillingForm({ subscriptionPlan }: BillingFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePortal = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao acessar portal");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      toast.error("Erro ao acessar portal de faturamento");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: pricingData[1].priceId.production.monthly,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar sessão");
      }

      const { sessionId } = await response.json();
      const stripe = await getStripe();
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      toast.error("Erro ao processar pagamento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Status da assinatura</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {subscriptionPlan?.stripeSubscriptionId
              ? "Você tem uma assinatura ativa"
              : "Você não tem uma assinatura ativa"}
          </p>
          {subscriptionPlan?.stripeCurrentPeriodEnd && (
            <p className="mt-1 text-sm text-muted-foreground">
              Próxima cobrança em{" "}
              {new Date(
                subscriptionPlan.stripeCurrentPeriodEnd,
              ).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>
        {subscriptionPlan?.stripeSubscriptionId ? (
          <Button variant="outline" onClick={handlePortal} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            Gerenciar assinatura
          </Button>
        ) : (
          <Button onClick={handleSubscribe} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            Assinar agora
          </Button>
        )}
      </div>
    </Card>
  );
}
