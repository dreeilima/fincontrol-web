import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return new NextResponse("Acesso negado", { status: 403 });
    }

    const plans = await prisma.plans.findMany({
      orderBy: {
        price: "asc",
      },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Erro ao buscar planos:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}

export async function POST(request: Request) {
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

    const plan = await prisma.plans.create({
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
    console.error("Erro ao criar plano:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return new NextResponse("Acesso negado", { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("ID do plano não fornecido", { status: 400 });
    }

    // Verificar se existem assinaturas ativas para este plano
    const activeSubscriptions = await prisma.subscriptions.count({
      where: {
        plan_id: id,
        status: "ACTIVE",
      },
    });

    if (activeSubscriptions > 0) {
      return new NextResponse(
        "Não é possível excluir um plano com assinaturas ativas",
        { status: 400 },
      );
    }

    await prisma.plans.delete({
      where: {
        id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Erro ao excluir plano:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
