"use client";

import { useEffect, useState } from "react";
import { User } from "next-auth";
import { toast } from "sonner";

import { PLANS } from "@/config/subscriptions";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/shared/icons";

interface BillingFormProps {
  subscriptionPlan: Partial<User> & {
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    stripePriceId: string | null;
    stripeCurrentPeriodEnd: Date | null;
  };
}

export function BillingForm({ subscriptionPlan }: BillingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    console.log("PLANS:", PLANS);
  }, []);

  async function onSubmit(priceId: string) {
    try {
      setIsLoading(true);
      setSelectedPlan(priceId);

      console.log("Enviando priceId:", priceId);

      const response = await fetch("/api/users/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Algo deu errado. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {Object.entries(PLANS).map(([key, plan]) => (
        <Card
          key={key}
          className={`flex flex-col ${
            subscriptionPlan.stripePriceId === plan.priceId
              ? "border-2 border-primary"
              : ""
          }`}
        >
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex h-full flex-col gap-6">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">
                  {formatCurrency(plan.price)}
                </span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <div className="space-y-2">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Icons.check className="size-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => {
                console.log(
                  "Clicou no plano:",
                  plan.name,
                  "priceId:",
                  plan.priceId,
                );
                onSubmit(plan.priceId!);
              }}
              disabled={
                isLoading ||
                selectedPlan === plan.priceId ||
                subscriptionPlan.stripePriceId === plan.priceId
              }
              className="w-full"
            >
              {isLoading && selectedPlan === plan.priceId && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              {subscriptionPlan.stripePriceId === plan.priceId
                ? "Plano Atual"
                : "Selecionar Plano"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
