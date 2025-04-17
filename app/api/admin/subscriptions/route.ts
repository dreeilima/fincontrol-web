import { NextResponse } from "next/server";
import { Prisma, UserRole } from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const userRole = session.user.role as UserRole;
    if (userRole !== UserRole.ADMIN) {
      return new NextResponse("Acesso negado", { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Prisma.subscriptionsWhereInput = {
      ...(status && { status }),
      ...(search && {
        OR: [
          {
            user: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
          {
            user: {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ],
      }),
    };

    const [subscriptions, total] = await Promise.all([
      prisma.subscriptions.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.subscriptions.count({ where }),
    ]);

    return NextResponse.json({
      subscriptions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Erro ao listar assinaturas:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const userRole = session.user.role as UserRole;
    if (userRole !== UserRole.ADMIN) {
      return new NextResponse("Acesso negado", { status: 403 });
    }

    const body = await request.json();
    const { userId, plan, status } = body;

    if (!userId || !plan || !status) {
      return new NextResponse("Dados inválidos", { status: 400 });
    }

    const subscription = await prisma.subscriptions.create({
      data: {
        user_id: userId,
        plan,
        status,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Erro ao criar assinatura:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
