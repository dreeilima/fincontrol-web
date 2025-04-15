import { auth } from "@/auth";
import { z } from "zod";

import { db } from "@/lib/db";

// Schema para validação dos dados
const budgetSettingsSchema = z.object({
  monthlyBudget: z.number().min(0),
  savingsGoal: z.number().min(0).max(100),
});

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Verificar se o usuário já tem configurações
    const userSettings = await db.budgetSettings.findUnique({
      where: { userId: session.user.id },
    });

    // Se não tiver, retornar valores padrão
    if (!userSettings) {
      return Response.json({
        monthlyBudget: 5000,
        savingsGoal: 20,
      });
    }

    return Response.json({
      monthlyBudget: userSettings.monthlyBudget,
      savingsGoal: userSettings.savingsGoal,
    });
  } catch (error) {
    console.error("Erro ao buscar configurações de orçamento:", error);
    return Response.json(
      { error: "Erro ao buscar configurações de orçamento" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = budgetSettingsSchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        { error: "Dados inválidos", details: validationResult.error.format() },
        { status: 400 },
      );
    }

    const { monthlyBudget, savingsGoal } = validationResult.data;

    // Verificar se o usuário existe
    const user = await db.users.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });

    if (!user) {
      return Response.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    // Verificar se já existem configurações para este usuário
    const existingSettings = await db.budgetSettings.findUnique({
      where: { userId: session.user.id },
    });

    let updatedSettings;

    if (existingSettings) {
      // Atualizar configurações existentes
      updatedSettings = await db.budgetSettings.update({
        where: { userId: session.user.id },
        data: {
          monthlyBudget,
          savingsGoal,
        },
      });
    } else {
      // Criar novas configurações
      updatedSettings = await db.budgetSettings.create({
        data: {
          userId: session.user.id,
          monthlyBudget,
          savingsGoal,
        },
      });
    }

    return Response.json(updatedSettings);
  } catch (error) {
    console.error("Erro ao atualizar configurações de orçamento:", error);
    return Response.json(
      { error: "Erro ao atualizar configurações de orçamento" },
      { status: 500 },
    );
  }
}
