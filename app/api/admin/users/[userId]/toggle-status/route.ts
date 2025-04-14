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

    const { isActive } = await req.json();

    const user = await db.users.findUnique({
      where: { id: params.userId },
      select: { id: true, is_active: true },
    });

    if (!user) {
      return new NextResponse("Usuário não encontrado", { status: 404 });
    }

    const updatedUser = await db.users.update({
      where: { id: params.userId },
      data: { is_active: isActive },
      select: { id: true, is_active: true },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_TOGGLE_STATUS]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
