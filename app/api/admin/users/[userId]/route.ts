import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const body = await req.json();
    const { name, role, isActive } = body;

    const user = await db.users.update({
      where: {
        id: params.userId,
      },
      data: {
        name,
        role,
        is_active: isActive,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_PATCH]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
