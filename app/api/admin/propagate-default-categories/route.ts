import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/lib/db";

// Função auxiliar para verificar e criar categoria
async function createCategoryIfNotExists(
  userId: string,
  name: string,
  type: "INCOME" | "EXPENSE",
  color: string | null,
  icon: string | null,
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
      is_default: false, // Não é uma categoria padrão do sistema, mas do usuário
    },
  });

  console.log(`Categoria ${name} (${type}) criada para o usuário ${userId}.`);
  return newCategory;
}

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Buscar todas as categorias padrão
    const defaultCategories = await db.categories.findMany({
      where: {
        is_default: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    if (defaultCategories.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Não existem categorias padrão para propagar. Por favor, inicialize as categorias primeiro.",
        },
        { status: 400 },
      );
    }

    console.log(
      `Encontradas ${defaultCategories.length} categorias padrão para propagar`,
    );

    // Buscar todos os usuários (exceto o administrador atual)
    const users = await db.users.findMany({
      where: {
        id: {
          not: session.user.id,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    console.log(`Encontrados ${users.length} usuários para receber categorias`);

    let totalCategoriesCreated = 0;
    let totalUsersUpdated = 0;
    let usersWithErrors = 0;

    // Para cada usuário, verificar e atualizar categorias
    for (const user of users) {
      try {
        let userCategoriesCreated = 0;

        // Adicionar categorias padrão que o usuário não possui
        for (const defaultCategory of defaultCategories) {
          try {
            const newCategory = await createCategoryIfNotExists(
              user.id,
              defaultCategory.name,
              defaultCategory.type as "INCOME" | "EXPENSE",
              defaultCategory.color,
              defaultCategory.icon,
            );

            if (newCategory) {
              userCategoriesCreated++;
              totalCategoriesCreated++;
            }
          } catch (err) {
            console.error(
              `Erro ao criar categoria ${defaultCategory.name} para usuário ${user.id}:`,
              err,
            );
          }
        }

        if (userCategoriesCreated > 0) {
          console.log(
            `Criadas ${userCategoriesCreated} categorias para o usuário ${user.name || user.id}`,
          );
          totalUsersUpdated++;
        }
      } catch (error) {
        console.error(`Erro ao processar usuário ${user.id}:`, error);
        usersWithErrors++;
      }
    }

    console.log(
      `Propagação completa: ${totalCategoriesCreated} categorias criadas para ${totalUsersUpdated} usuários`,
    );

    return NextResponse.json({
      success: true,
      message: `Categorias propagadas com sucesso para ${totalUsersUpdated} usuários (${totalCategoriesCreated} novas categorias criadas)`,
      usersUpdated: totalUsersUpdated,
      categoriesCreated: totalCategoriesCreated,
      usersWithErrors: usersWithErrors,
    });
  } catch (error) {
    console.error("[PROPAGATE_DEFAULT_CATEGORIES_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao propagar categorias padrão" },
      { status: 500 },
    );
  }
}
