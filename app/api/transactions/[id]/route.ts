import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Decimal } from "@prisma/client/runtime/library";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    await db.transactions.delete({
      where: {
        id: params.id,
        user_id: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[TRANSACTION_DELETE]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const { amount, description, categoryId, date, type } = await req.json();

    const category = await db.categories.findUnique({
      where: { id: categoryId },
      select: { name: true },
    });

    if (!category) {
      return new NextResponse("Categoria não encontrada", { status: 404 });
    }

    const transaction = await db.transactions.update({
      where: {
        id: params.id,
        user_id: session.user.id,
      },
      data: {
        amount: new Decimal(amount),
        description,
        categoryId,
        category: category.name,
        date: new Date(date),
        type,
      },
      include: {
        categories: true,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("[TRANSACTION_PUT]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
