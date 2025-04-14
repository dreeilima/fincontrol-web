import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

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
        created_at: true,
        _count: {
          select: {
            transactions: true,
          },
        },
        transactions: {
          select: {
            amount: true,
            created_at: true,
          },
          orderBy: {
            created_at: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        created_at: "desc",
      },
      take: 5,
    });

    const topUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      totalTransactions: user._count.transactions,
      totalAmount: user.transactions.reduce(
        (acc, t) => acc + t.amount.toNumber(),
        0,
      ),
      lastActivity: user.transactions[0]?.created_at || null,
    }));

    return NextResponse.json(topUsers);
  } catch (error) {
    console.error("[TOP_USERS_GET]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
