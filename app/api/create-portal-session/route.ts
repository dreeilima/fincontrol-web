import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!session.user.stripe_customer_id) {
      return new NextResponse("Customer not found", { status: 404 });
    }

    const headersList = headers();
    const origin = headersList.get("origin");

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: session.user.stripe_customer_id,
      return_url: `${origin}/dashboard/assinatura`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("[PORTAL_SESSION]", error);
    return NextResponse.json(
      { error: "Erro ao criar sessão do portal" },
      { status: 500 },
    );
  }
}
