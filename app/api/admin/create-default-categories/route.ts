import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { v4 as uuidv4 } from "uuid";

import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
} from "@/lib/constants/default-categories";
import { db } from "@/lib/db";

// Função auxiliar para verificar e criar categoria
async function createCategoryIfNotExists(
  userId: string,
  name: string,
  type: "INCOME" | "EXPENSE",
  color: string,
  icon: string,
  isDefault: boolean = false,
) {
  // Verificar se a categoria já existe
  const existingCategory = await db.categories.findFirst({
    where: {
      user_id: userId,
      name: name,
      type: type,
    },
  });

  if (existingCategory) {
    console.log(
      `Categoria ${name} (${type}) já existe para o usuário ${userId}.`,
    );
    return null;
  }

  // Se não existir, criar a categoria
  const newCategory = await db.categories.create({
    data: {
      id: uuidv4(),
      name: name,
      type: type,
      color: color,
      icon: icon,
      user_id: userId,
      is_default: isDefault,
    },
  });

  console.log(`Categoria ${name} (${type}) criada para o usuário ${userId}.`);
  return newCategory;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Verificar se existem categorias padrão no sistema
    const defaultCategories = await db.categories.findMany({
      where: {
        is_default: true,
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });

    let systemCategoriesCreated = 0;
    let userCategoriesCreated = 0;

    // Se não existirem categorias padrão, criar as categorias padrão do sistema
    if (defaultCategories.length === 0) {
      // Criar categorias de receita
      for (const category of DEFAULT_INCOME_CATEGORIES) {
        await createCategoryIfNotExists(
          session.user.id,
          category.name,
          "INCOME",
          category.color,
          category.icon,
          true,
        );
      }

      // Criar categorias de despesa
      for (const category of DEFAULT_EXPENSE_CATEGORIES) {
        await createCategoryIfNotExists(
          session.user.id,
          category.name,
          "EXPENSE",
          category.color,
          category.icon,
          true,
        );
      }

      systemCategoriesCreated = 1;
      console.log("Categorias padrão do sistema criadas com sucesso!");
    }

    // Buscar todos os usuários que ainda não têm categorias
    const users = await db.users.findMany({
      where: {
        categories: {
          none: {}, // Usuários que não têm nenhuma categoria
        },
      },
      select: {
        id: true,
      },
    });

    // Criar categorias padrão para cada usuário
    for (const user of users) {
      // Criar categorias de receita
      for (const category of DEFAULT_INCOME_CATEGORIES) {
        await createCategoryIfNotExists(
          user.id,
          category.name,
          "INCOME",
          category.color,
          category.icon,
        );
      }

      // Criar categorias de despesa
      for (const category of DEFAULT_EXPENSE_CATEGORIES) {
        await createCategoryIfNotExists(
          user.id,
          category.name,
          "EXPENSE",
          category.color,
          category.icon,
        );
      }

      userCategoriesCreated++;
    }

    return NextResponse.json({
      success: true,
      message: `Categorias padrão criadas com sucesso! ${systemCategoriesCreated ? "Categorias do sistema inicializadas. " : ""}${userCategoriesCreated} usuários receberam categorias padrão.`,
      systemCategoriesCreated,
      usersProcessed: userCategoriesCreated,
    });
  } catch (error) {
    console.error("[CREATE_DEFAULT_CATEGORIES_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao criar categorias padrão" },
      { status: 500 },
    );
  }
}
