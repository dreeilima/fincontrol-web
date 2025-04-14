"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { Category } from "@prisma/client";

interface CategoriesContextType {
  categories: Category[];
  addCategory: (category: Category) => void;
  fetchCategories: () => Promise<void>;
}

export const CategoriesContext = createContext<CategoriesContextType | null>(
  null,
);

export function CategoriesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Erro ao buscar categorias");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  }, []);

  const addCategory = useCallback((category: Category) => {
    setCategories((prev) => [...prev, category]);
  }, []);

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        addCategory,
        fetchCategories,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (!context)
    throw new Error("useCategories must be used within CategoriesProvider");
  return context;
}
