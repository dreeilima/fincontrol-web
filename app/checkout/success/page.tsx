"use client";

import { CheckCircle2, Link } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AuthCheck } from "@/components/auth/auth-check";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function CheckoutSuccessPage() {
  return (
    <>
      <AuthCheck />
      <MaxWidthWrapper className="mb-20 mt-28">
        <Card className="mx-auto max-w-md p-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <CheckCircle2 className="size-12 text-green-500" />
            <h1 className="text-2xl font-bold">Pagamento confirmado!</h1>
            <p className="text-muted-foreground">
              Obrigado por assinar. Você já pode começar a usar todos os
              recursos premium.
            </p>
            <Button className="mt-4">
              <Link href="/dashboard">Ir para o Dashboard</Link>
            </Button>
          </div>
        </Card>
      </MaxWidthWrapper>
    </>
  );
}
