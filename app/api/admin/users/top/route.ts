import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const topUsers = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        transactions: {
          select: {
            createdAt: true,
            amount: true,
          },
        },
      },
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      take: 10,
    });

    return NextResponse.json(
      topUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        totalTransactions: user.transactions.length,
        totalAmount: user.transactions.reduce(
          (sum, t) => sum + (t.amount.toNumber() || 0),
          0,
        ),
        lastActivity: user.transactions[0]?.createdAt,
      })),
    );
  } catch (error) {
    console.error("[TOP_USERS]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
