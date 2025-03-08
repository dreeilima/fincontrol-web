import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Decimal } from "@prisma/client/runtime/library";

import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const { amount, description, categoryId, date, type } = await req.json();

    // Buscar a categoria para obter o nome
    const category = await db.category.findUnique({
      where: { id: categoryId },
      select: { name: true },
    });

    if (!category) {
      return new NextResponse("Categoria não encontrada", { status: 404 });
    }

    const transaction = await db.transaction.create({
      data: {
        amount: new Decimal(amount),
        description,
        categoryId,
        categoryName: category.name,
        date: new Date(date),
        type,
        userId: session.user.id,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("[TRANSACTIONS_POST]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const transactions = await db.transaction.findMany({
      where: {
        userId: session.user.id,
        ...(startDate && endDate
          ? {
              date: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            }
          : {}),
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("[TRANSACTIONS_GET]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
