import { v4 as uuidv4 } from "uuid";

import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
} from "@/lib/constants/default-categories";
import { db } from "@/lib/db";

export async function createDefaultCategories(userId: string) {
  // Criar categorias de receita
  for (const category of DEFAULT_INCOME_CATEGORIES) {
    await db.categories.create({
      data: {
        id: uuidv4(), // Generate a UUID for the id field
        name: category.name,
        type: "INCOME",
        user_id: userId,
      },
    });
  }

  // Criar categorias de despesa
  for (const category of DEFAULT_EXPENSE_CATEGORIES) {
    await db.categories.create({
      data: {
        id: uuidv4(), // Generate a UUID for the id field
        name: category.name,
        type: "EXPENSE",
        user_id: userId,
      },
    });
  }
}
