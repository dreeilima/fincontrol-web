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

    // Buscar a categoria pelo ID ao invés do nome
    const category = await db.categories.findFirst({
      where: {
        user_id: session.user.id,
        id: categoryId, // Usar o ID ao invés do nome
      },
    });

    if (!category) {
      return new NextResponse("Categoria não encontrada", { status: 404 });
    }

    const transaction = await db.transactions.create({
      data: {
        id: crypto.randomUUID(),
        amount: new Decimal(amount),
        description,
        categoryId,
        category: category.name, // Usar o nome da categoria encontrada
        date: new Date(date),
        type,
        user_id: session.user.id,
      },
      include: {
        categories: true,
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
    const startDate = searchParams.get("from");
    const endDate = searchParams.get("to");
    const type = searchParams.get("type");
    const categoryId = searchParams.get("category");

    console.log("Filtros recebidos na API:", {
      startDate,
      endDate,
      type,
      categoryId,
    });

    const transactions = await db.transactions.findMany({
      where: {
        user_id: session.user.id,
        ...(startDate && endDate
          ? {
              date: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            }
          : {}),
        ...(type ? { type } : {}),
        ...(categoryId ? { categoryId } : {}), // Filtrar por categoryId
      },
      include: {
        categories: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    console.log("Transações encontradas:", transactions.length);

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("[TRANSACTIONS_GET]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id } = body;

    // Buscar a categoria para obter o nome
    const category = await db.categories.findFirst({
      where: {
        user_id: session.user.id,
        id: body.categoryId, // Usa o categoryId recebido
      },
    });

    if (!category) {
      return new Response("Category not found", { status: 404 });
    }

    const date = new Date(`${body.date}T03:00:00.000Z`);

    const transaction = await db.transactions.update({
      where: {
        id,
        user_id: session.user.id,
      },
      data: {
        ...body,
        category: category.name, // Atualiza o nome da categoria
        categoryId: category.id, // Atualiza o ID da categoria
        date,
        updated_at: new Date(),
      },
      include: {
        categories: true,
      },
    });

    return new Response(JSON.stringify(transaction));
  } catch (error) {
    console.error("[TRANSACTION_PUT]", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
