import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const categories = await db.category.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        type: true,
        color: true,
        icon: true,
        _count: {
          select: {
            transactions: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[ADMIN_CATEGORIES_GET]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const { name, type, color, icon } = await req.json();

    const category = await db.category.create({
      data: {
        name,
        type,
        color,
        icon,
        userId: session.user.id,
        isDefault: true, // Marca como categoria padrão
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[ADMIN_CATEGORIES_POST]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
