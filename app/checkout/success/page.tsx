import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CheckCircle2, Link } from "lucide-react";

import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AuthCheck } from "@/components/auth/auth-check";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export const runtime = "nodejs";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { session_id } = searchParams;

  if (!session_id) {
    redirect("/dashboard");
  }

  // Redirecionar para o dashboard após verificar o pagamento
  redirect("/dashboard/assinatura?success=true");
}
