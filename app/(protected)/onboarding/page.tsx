import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { PLANS } from "@/config/subscriptions";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const session = await auth();
  const { session_id } = searchParams;

  if (!session?.user) {
    console.log(
      "Onboarding: Usuário não autenticado, redirecionando para login",
    );
    return redirect("/login");
  }

  console.log("Onboarding: Usuário autenticado", session.user.id);

  if (session_id) {
    try {
      console.log("Onboarding: Verificando sessão do Stripe", session_id);
      const stripeSession = await stripe.checkout.sessions.retrieve(
        session_id,
        {
          expand: ["line_items.data.price"],
        },
      );

      if (stripeSession.payment_status === "paid") {
        console.log("Onboarding: Pagamento confirmado");

        // Verificar se já existe uma assinatura
        const existingSubscription = await db.subscriptions.findUnique({
          where: { user_id: session.user.id },
        });

        // Obter detalhes do plano
        const priceId = stripeSession.line_items?.data[0]?.price?.id || "";
        const planKey =
          Object.keys(PLANS).find((key) => PLANS[key].id === priceId) ||
          "basic";

        if (existingSubscription) {
          // Atualizar assinatura existente
          await db.subscriptions.update({
            where: { id: existingSubscription.id },
            data: {
              stripe_subscription_id: stripeSession.subscription as string,
              stripe_customer_id: stripeSession.customer as string,
              stripe_price_id: priceId,
              plan: planKey,
              status: "active",
              stripe_current_period_end: new Date(
                (stripeSession.expires_at || Date.now() / 1000) * 1000,
              ),
            },
          });
        } else {
          // Criar nova assinatura
          await db.subscriptions.create({
            data: {
              user_id: session.user.id,
              stripe_subscription_id: stripeSession.subscription as string,
              stripe_customer_id: stripeSession.customer as string,
              stripe_price_id: priceId,
              plan: planKey,
              status: "active",
              stripe_current_period_end: new Date(
                (stripeSession.expires_at || Date.now() / 1000) * 1000,
              ),
            },
          });
        }

        console.log("Onboarding: Assinatura atualizada/criada com sucesso");
      }
    } catch (error) {
      console.error("Erro ao verificar sessão do Stripe:", error);
    }
  }

  // Vamos verificar se o usuário tem uma assinatura válida antes de redirecionar
  try {
    const subscription = await db.subscriptions.findUnique({
      where: { user_id: session.user.id },
    });

    if (subscription && subscription.status === "active") {
      console.log(
        "Onboarding: Usuário tem assinatura ativa, redirecionando para dashboard",
      );
      return redirect("/dashboard");
    }

    console.log(
      "Onboarding: Usuário não tem assinatura ativa, redirecionando para pricing",
    );
    return redirect("/pricing");
  } catch (error) {
    console.error("Erro ao verificar assinatura:", error);
    return redirect("/dashboard");
  }
}
