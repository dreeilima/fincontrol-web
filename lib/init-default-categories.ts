import { v4 as uuidv4 } from "uuid";

import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
} from "@/lib/constants/default-categories";
import { db } from "@/lib/db";

// Função para inicializar categorias padrão no sistema
export async function initializeDefaultCategories() {
  try {
    console.log("Iniciando processo de inicialização de categorias padrão...");

    // Verificar se já existem categorias padrão
    const existingCategories = await db.categories.findMany({
      where: {
        is_default: true,
      },
      select: {
        id: true,
        name: true,
        type: true,
        user_id: true,
      },
    });

    // Se já existirem categorias, verificar se todas as categorias padrão estão presentes
    if (existingCategories.length > 0) {
      console.log(
        `Encontradas ${existingCategories.length} categorias padrão existentes.`,
      );

      // Criar mapas para verificação rápida
      const existingCategoriesMap = new Map(
        existingCategories.map((cat) => [`${cat.name}-${cat.type}`, true]),
      );

      // Verificar categorias de receita faltantes
      for (const category of DEFAULT_INCOME_CATEGORIES) {
        const key = `${category.name}-INCOME`;
        if (!existingCategoriesMap.has(key)) {
          console.log(`Categoria de receita faltante: ${category.name}`);
          await createDefaultCategory(
            "INCOME",
            category,
            existingCategories[0].user_id,
          );
        }
      }

      // Verificar categorias de despesa faltantes
      for (const category of DEFAULT_EXPENSE_CATEGORIES) {
        const key = `${category.name}-EXPENSE`;
        if (!existingCategoriesMap.has(key)) {
          console.log(`Categoria de despesa faltante: ${category.name}`);
          await createDefaultCategory(
            "EXPENSE",
            category,
            existingCategories[0].user_id,
          );
        }
      }

      console.log("Verificação e criação de categorias faltantes concluída.");
      return;
    }

    console.log("Nenhuma categoria padrão encontrada. Iniciando criação...");

    // Buscar um usuário administrador para associar as categorias
    const adminUser = await db.users.findFirst({
      where: {
        role: "ADMIN",
      },
      select: {
        id: true,
      },
    });

    if (!adminUser) {
      console.log(
        "Nenhum usuário administrador encontrado. Categorias padrão não foram criadas.",
      );
      return;
    }

    // Criar categorias de receita
    for (const category of DEFAULT_INCOME_CATEGORIES) {
      await createDefaultCategory("INCOME", category, adminUser.id);
    }

    // Criar categorias de despesa
    for (const category of DEFAULT_EXPENSE_CATEGORIES) {
      await createDefaultCategory("EXPENSE", category, adminUser.id);
    }

    console.log("Categorias padrão inicializadas com sucesso!");
  } catch (error) {
    console.error("Erro ao inicializar categorias padrão:", error);
    throw error; // Propagar o erro para tratamento adequado
  }
}

// Função auxiliar para criar uma categoria padrão
async function createDefaultCategory(
  type: "INCOME" | "EXPENSE",
  category: { name: string; color: string; icon: string },
  userId: string,
) {
  try {
    await db.categories.create({
      data: {
        id: uuidv4(),
        name: category.name,
        type: type,
        color: category.color,
        icon: category.icon,
        user_id: userId,
        is_default: true,
      },
    });
    console.log(`Categoria padrão criada: ${category.name} (${type})`);
  } catch (error) {
    console.error(`Erro ao criar categoria ${category.name}:`, error);
    throw error;
  }
}
