import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string } },
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const body = await req.json();
    const { name, type, color, icon } = body;

    // Primeiro, verificamos se a categoria existe
    const existingCategory = await db.categories.findUnique({
      where: {
        id: params.categoryId,
      },
    });

    if (!existingCategory) {
      return new NextResponse("Categoria não encontrada", { status: 404 });
    }

    // Agora atualizamos a categoria
    const category = await db.categories.update({
      where: {
        id: params.categoryId,
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

    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const category = await db.categories.findUnique({
      where: {
        id: params.categoryId,
      },
    });

    if (!category) {
      return new NextResponse("Categoria não encontrada", { status: 404 });
    }

    await db.categories.delete({
      where: {
        id: params.categoryId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
