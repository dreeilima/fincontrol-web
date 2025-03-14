import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Verificar se o cliente Prisma está inicializado
    if (!db) {
      console.error("Cliente Prisma não inicializado");
      return new NextResponse("Erro de configuração do banco de dados", {
        status: 500,
      });
    }

    const categories = await db.categories.findMany({
      where: {
        user_id: session.user.id,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const { name, type, icon, color } = await req.json();

    const category = await db.categories.create({
      data: {
        id: crypto.randomUUID(),
        name,
        type,
        icon,
        color,
        user_id: session.user.id,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORIES_POST]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
