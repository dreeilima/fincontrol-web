import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const categories = await db.categories.findMany({
      where: {
        user_id: session.user.id,
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
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const { name, type, color, icon } = await req.json();

    const category = await db.categories.create({
      data: {
        id: crypto.randomUUID(),
        name,
        type,
        color,
        icon,
        user_id: session.user.id,
        is_default: true, // Updated to match schema field name
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[ADMIN_CATEGORIES_POST]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
