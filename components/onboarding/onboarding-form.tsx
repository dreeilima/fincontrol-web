"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { FinancialGoals } from "@/components/onboarding/financial-goals";
import { Icons } from "@/components/shared/icons"; // Corrigido o caminho do import

export function OnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        router.push("/pricing");
        return;
      }

      try {
        const response = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          throw new Error("Falha na verificação");
        }

        const { success } = await response.json();
        if (success) {
          setIsVerified(true);
        } else {
          throw new Error("Pagamento não confirmado");
        }
      } catch (error) {
        toast.error("Erro ao verificar pagamento");
        router.push("/pricing");
      }
    };

    verifyPayment();
  }, [sessionId, router]);

  const handleComplete = () => {
    router.push("/dashboard");
  };

  if (!isVerified) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="animate-spin">
          <Icons.spinner className="size-8" />
        </div>
        <p className="text-muted-foreground">Verificando seu pagamento...</p>
      </div>
    );
  }

  return <FinancialGoals onNext={handleComplete} />;
}
