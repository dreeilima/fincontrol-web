"use client";

import { Link, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AuthCheck } from "@/components/auth/auth-check";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function CheckoutErrorPage() {
  return (
    <>
      <AuthCheck />
      <MaxWidthWrapper className="mb-20 mt-28">
        <Card className="mx-auto max-w-md p-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <XCircle className="size-12 text-red-500" />
            <h1 className="text-2xl font-bold">Erro no pagamento</h1>
            <p className="text-muted-foreground">
              Houve um problema ao processar seu pagamento. Por favor, tente
              novamente.
            </p>
            <Button className="mt-4">
              <Link href="/dashboard/assinatura">Voltar para Assinatura</Link>
            </Button>
          </div>
        </Card>
      </MaxWidthWrapper>
    </>
  );
}
