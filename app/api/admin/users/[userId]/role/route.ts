import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

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

    const { role } = await req.json();

    if (!role || !Object.values(UserRole).includes(role as UserRole)) {
      return new NextResponse("Função inválida", { status: 400 });
    }

    const user = await db.users.findUnique({
      where: { id: params.userId },
      select: { id: true, role: true },
    });

    if (!user) {
      return new NextResponse("Usuário não encontrado", { status: 404 });
    }

    const updatedUser = await db.users.update({
      where: { id: params.userId },
      data: { role: role as UserRole },
      select: { id: true, role: true },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_UPDATE_ROLE]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
