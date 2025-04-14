"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Session } from "next-auth";
import { toast } from "sonner";

import { pricingData } from "@/config/subscriptions";
import { CheckoutForm } from "@/components/forms/checkout-form";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

interface CheckoutPageClientProps {
  session: Session | null;
}

export function CheckoutPageClient({ session }: CheckoutPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan");

  useEffect(() => {
    if (!selectedPlan) {
      toast.error("Selecione um plano primeiro");
      router.push("/pricing");
    }
  }, [selectedPlan, router]);

  const plan = pricingData.find(
    (p) => p.title.toLowerCase() === selectedPlan?.toLowerCase(),
  );

  if (!plan) {
    return null;
  }

  return (
    <MaxWidthWrapper className="mb-20 mt-12">
      <div className="mx-auto max-w-5xl">
        <HeaderSection
          title="Finalizar assinatura"
          subtitle="Você está a um passo de ter controle total das suas finanças"
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Resumo do plano */}
          <div className="rounded-2xl border bg-muted/50 p-8">
            <h3 className="text-xl font-semibold">Resumo do plano</h3>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{plan.title}</span>
                <span className="text-lg font-semibold">
                  R$ {plan.price.monthly.toFixed(2)}/mês
                </span>
              </div>

              <div className="border-t pt-4">
                <p className="mb-4 font-medium">O que está incluído:</p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-x-3">
                      <Icons.check className="mt-1 size-4 shrink-0 text-green-500" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-secondary/50 p-4">
                <p className="text-sm text-muted-foreground">
                  Ao assinar, você concorda com nossos{" "}
                  <a href="/terms" className="underline hover:text-primary">
                    Termos de Serviço
                  </a>{" "}
                  e{" "}
                  <a href="/privacy" className="underline hover:text-primary">
                    Política de Privacidade
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Formulário de pagamento */}
          <div className="rounded-2xl border p-8">
            <h3 className="mb-6 text-xl font-semibold">
              Informações de pagamento
            </h3>
            <CheckoutForm plan={plan} />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-x-2 text-sm text-muted-foreground">
          <Icons.shield className="size-4" />
          <span>Pagamento seguro processado pela Stripe</span>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
