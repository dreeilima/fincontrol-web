import { v4 as uuidv4 } from "uuid";

import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
} from "@/lib/constants/default-categories";
import { db } from "@/lib/db";

export async function createDefaultCategories(userId: string) {
  try {
    console.log(`Criando categorias padrão para o usuário ${userId}...`);

    // Buscar todas as categorias padrão do sistema
    const defaultCategories = await db.categories.findMany({
      where: {
        is_default: true,
      },
    });

    // Se existirem categorias padrão, copiá-las para o usuário
    if (defaultCategories.length > 0) {
      console.log(
        `Copiando ${defaultCategories.length} categorias padrão para o usuário ${userId}`,
      );

      for (const category of defaultCategories) {
        await db.categories.create({
          data: {
            id: uuidv4(),
            name: category.name,
            type: category.type,
            color: category.color,
            icon: category.icon,
            user_id: userId,
            is_default: false, // Não é uma categoria padrão do sistema, mas do usuário
          },
        });
      }
    } else {
      // Se não existirem categorias padrão, criar categorias básicas
      console.log(
        "Nenhuma categoria padrão encontrada. Criando categorias básicas...",
      );

      // Criar categorias de receita
      for (const category of DEFAULT_INCOME_CATEGORIES) {
        await db.categories.create({
          data: {
            id: uuidv4(),
            name: category.name,
            type: "INCOME",
            color: category.color,
            icon: category.icon,
            user_id: userId,
            is_default: false,
          },
        });
      }

      // Criar categorias de despesa
      for (const category of DEFAULT_EXPENSE_CATEGORIES) {
        await db.categories.create({
          data: {
            id: uuidv4(),
            name: category.name,
            type: "EXPENSE",
            color: category.color,
            icon: category.icon,
            user_id: userId,
            is_default: false,
          },
        });
      }
    }

    console.log(
      `Categorias padrão criadas com sucesso para o usuário ${userId}`,
    );
  } catch (error) {
    console.error(
      `Erro ao criar categorias padrão para o usuário ${userId}:`,
      error,
    );
  }
}

// Função para criar as categorias padrão do sistema
export async function createSystemDefaultCategories(adminUserId: string) {
  if (!adminUserId) {
    throw new Error(
      "ID do usuário administrador é obrigatório para criar categorias padrão",
    );
  }

  // Verificar se o usuário existe
  const adminUser = await db.users.findUnique({
    where: {
      id: adminUserId,
    },
  });

  if (!adminUser) {
    throw new Error("Usuário administrador não encontrado");
  }

  console.log(
    `Criando categorias padrão usando o usuário admin: ${adminUserId}`,
  );

  // Criar categorias de receita
  for (const category of DEFAULT_INCOME_CATEGORIES) {
    await db.categories.create({
      data: {
        id: uuidv4(),
        name: category.name,
        type: "INCOME",
        color: category.color, // Usar a cor definida na categoria
        icon: category.icon, // Usar o ícone definido na categoria
        user_id: adminUserId, // Usar o ID do administrador
        is_default: true, // É uma categoria padrão do sistema
      },
    });
  }

  // Criar categorias de despesa
  for (const category of DEFAULT_EXPENSE_CATEGORIES) {
    await db.categories.create({
      data: {
        id: uuidv4(),
        name: category.name,
        type: "EXPENSE",
        color: category.color, // Usar a cor definida na categoria
        icon: category.icon, // Usar o ícone definido na categoria
        user_id: adminUserId, // Usar o ID do administrador
        is_default: true, // É uma categoria padrão do sistema
      },
    });
  }

  console.log("Categorias padrão do sistema criadas com sucesso!");
}
