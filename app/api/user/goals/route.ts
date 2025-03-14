import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const body = await req.json();
    const { monthlyBudget, savingsGoal, savingsFrequency } = body;

    await db.user_goals.create({
      data: {
        user_id: session.user.id,
        monthly_budget: parseFloat(monthlyBudget),
        savings_goal: parseFloat(savingsGoal),
        savings_frequency: savingsFrequency,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[GOALS_POST]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
