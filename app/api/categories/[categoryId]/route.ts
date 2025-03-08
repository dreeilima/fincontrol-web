import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const { name, type, color, icon } = await req.json();

    const category = await db.category.update({
      where: {
        id: params.categoryId,
        userId: session.user.id,
      },
      data: {
        name,
        type,
        color,
        icon,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_PATCH]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Verifica se existem transações usando esta categoria
    const transactions = await db.transaction.findFirst({
      where: {
        categoryId: params.categoryId,
        userId: session.user.id,
      },
    });

    if (transactions) {
      return new NextResponse(
        "Não é possível excluir uma categoria que possui transações",
        { status: 400 },
      );
    }

    await db.category.delete({
      where: {
        id: params.categoryId,
        userId: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
