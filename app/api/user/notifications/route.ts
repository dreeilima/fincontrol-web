import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const body = await req.json();
    const { emailNotifications, marketingEmails } = body;

    const user = await db.users.update({
      where: {
        id: session.user.id,
      },
      data: {
        emailNotifications,
        marketingEmails,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_NOTIFICATIONS_PATCH]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
