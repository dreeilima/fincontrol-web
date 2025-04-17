import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { v4 as uuidv4 } from "uuid";

import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
} from "@/lib/constants/default-categories";
import { db } from "@/lib/db";

// Definir a interface da categoria para tipagem correta
interface CategoryType {
  id: string;
  name: string;
  type: string;
  color: string | null;
  icon: string | null;
  user_id: string;
  is_default: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const adminId = session.user.id;
    console.log(`Tentando inicializar categorias padrão para admin ${adminId}`);

    // Remover todas as categorias existentes do admin
    console.log("Removendo categorias existentes...");
    await db.categories.deleteMany({
      where: {
        user_id: adminId,
      },
    });
    console.log("Categorias existentes removidas com sucesso");

    // Array para armazenar as categorias que serão criadas
    const createdCategories: CategoryType[] = [];

    // Criar categorias de receita
    for (const category of DEFAULT_INCOME_CATEGORIES) {
      try {
        const newCategory = await db.categories.create({
          data: {
            id: uuidv4(),
            name: category.name,
            type: "INCOME",
            color: category.color,
            icon: category.icon,
            user_id: adminId,
            is_default: true,
          },
        });
        createdCategories.push(newCategory as CategoryType);
        console.log(`Categoria ${category.name} (INCOME) criada com sucesso`);
      } catch (err) {
        console.error(
          `Erro ao criar categoria de receita ${category.name}:`,
          err,
        );
      }
    }

    // Criar categorias de despesa
    for (const category of DEFAULT_EXPENSE_CATEGORIES) {
      try {
        const newCategory = await db.categories.create({
          data: {
            id: uuidv4(),
            name: category.name,
            type: "EXPENSE",
            color: category.color,
            icon: category.icon,
            user_id: adminId,
            is_default: true,
          },
        });
        createdCategories.push(newCategory as CategoryType);
        console.log(`Categoria ${category.name} (EXPENSE) criada com sucesso`);
      } catch (err) {
        console.error(
          `Erro ao criar categoria de despesa ${category.name}:`,
          err,
        );
      }
    }

    // Contar quantas categorias foram criadas
    const totalCategories = createdCategories.length;

    console.log(
      `Processo concluído. Total de categorias criadas: ${totalCategories}`,
    );

    return NextResponse.json({
      success: true,
      message: `${totalCategories} categorias padrão foram criadas com sucesso`,
      categoriesCount: totalCategories,
    });
  } catch (error) {
    console.error("[INITIALIZE_DEFAULT_CATEGORIES_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao inicializar categorias padrão" },
      { status: 500 },
    );
  }
}
