import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { categoryId: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const body = await req.json();
    const { name, type, color, icon } = body;

    const category = await db.categories.update({
      where: {
        id: params.categoryId,
        user_id: session.user.id,
      },
      data: {
        name,
        type,
        color,
        icon,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_PUT]", error);
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
    const transactions = await db.transactions.findFirst({
      where: {
        categoryId: params.categoryId,
        user_id: session.user.id,
      },
    });

    if (transactions) {
      return new NextResponse(
        "Não é possível excluir uma categoria que possui transações",
        { status: 400 },
      );
    }

    await db.categories.delete({
      where: {
        id: params.categoryId,
        user_id: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
