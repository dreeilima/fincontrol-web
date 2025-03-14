import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { settingsSchema } from "@/lib/validations/settings";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const payload = settingsSchema.parse(body);

    await db.users.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone || "",
      },
    });

    return NextResponse.json(
      { message: "Informações atualizadas com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[USERS_UPDATE]", error);
    return NextResponse.json(
      { error: "Erro ao atualizar informações" },
      { status: 500 },
    );
  }
}
