import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const body = await req.json();
    const { priceId } = body;

    if (!priceId) {
      return new NextResponse("Price ID é obrigatório", { status: 400 });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/assinatura?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/assinatura?canceled=true`,
      customer_email: session.user.email!,
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        priceId,
      },
    });

    if (!stripeSession.url) {
      return new NextResponse("Erro ao criar sessão", { status: 500 });
    }

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("[STRIPE]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
