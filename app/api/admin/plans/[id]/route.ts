import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return new NextResponse("Acesso negado", { status: 403 });
    }

    const plan = await prisma.plans.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!plan) {
      return new NextResponse("Plano não encontrado", { status: 404 });
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Erro ao buscar plano:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return new NextResponse("Acesso negado", { status: 403 });
    }

    const body = await request.json();

    const {
      name,
      description,
      price,
      features,
      benefits,
      limitations,
      is_active,
    } = body;

    if (
      !name ||
      !description ||
      price === undefined ||
      !features ||
      !benefits ||
      !limitations
    ) {
      return new NextResponse("Dados inválidos", { status: 400 });
    }

    const plan = await prisma.plans.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        description,
        price,
        features,
        benefits,
        limitations,
        is_active,
      },
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Erro ao atualizar plano:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
