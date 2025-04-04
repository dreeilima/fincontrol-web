import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const users = await db.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
        subscription: {
          select: {
            plan: true,
            status: true,
          },
        },
        _count: {
          select: {
            transactions: true,
            categories: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      plan: user.subscription?.plan || "basic",
      status: user.subscription?.status || "inactive",
      _count: user._count,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("[USERS_GET]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
