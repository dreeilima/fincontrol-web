"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Session } from "next-auth";
import { toast } from "sonner";

import { pricingData } from "@/config/subscriptions";

interface CheckoutFormProps {
  session: Session | null;
}

export function CheckoutForm({ session }: CheckoutFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan");

  useEffect(() => {
    if (!selectedPlan) {
      toast.error("Selecione um plano primeiro");
      router.push("/pricing");
    }
  }, [selectedPlan, router]);

  async function onSubmit() {
    try {
      const plan = pricingData.find(
        (p) => p.title.toLowerCase() === selectedPlan?.toLowerCase(),
      );

      if (!plan) {
        throw new Error("Plano não encontrado");
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: plan.priceId.production.monthly,
        }),
      });

      if (!response.ok) throw new Error("Falha na requisição");

      const { sessionId } = await response.json();
      // Redirecionar para o Stripe
      window.location.href = `https://checkout.stripe.com/c/pay/${sessionId}`;
    } catch (error) {
      toast.error("Erro ao processar pagamento");
      console.error(error);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Checkout</h1>
      <button
        onClick={onSubmit}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Pagar agora
      </button>
    </div>
  );
}
