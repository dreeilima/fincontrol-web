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

    const subscription = await prisma.subscriptions.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        plan: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    if (!subscription) {
      return new NextResponse("Assinatura não encontrada", { status: 404 });
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Erro ao buscar assinatura:", error);
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

    const { status, end_date } = body;

    if (!status || !end_date) {
      return new NextResponse("Dados inválidos", { status: 400 });
    }

    const subscription = await prisma.subscriptions.update({
      where: {
        id: params.id,
      },
      data: {
        status,
        end_date: new Date(end_date),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        plan: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Erro ao atualizar assinatura:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}

export async function DELETE(
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

    await prisma.subscriptions.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Erro ao deletar assinatura:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
