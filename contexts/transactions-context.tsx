"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useDateRange } from "./date-range-context";

interface Category {
  id: string;
  user_id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  created_at: string;
  color: string | null;
  icon: string | null;
  is_default: boolean;
  updated_at: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: string;
  date: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  categoryId: string;
  user_id: string;
  created_at: string;
  bankAccountId: string | null;
  accountId: string | null;
  updated_at: string;
  categories: Category;
}

interface TransactionsContextType {
  transactions: Transaction[];
  categories: Category[];
  filterTransactions: (filters: {
    from?: string;
    to?: string;
    type?: string;
    category?: string;
  }) => void;
  isLoading: boolean;
  refreshTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>;
  updateTransaction: (
    id: string,
    transaction: Partial<Transaction>,
  ) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  createCategory: (category: {
    name: string;
    type: "INCOME" | "EXPENSE";
    color: string;
    icon?: string;
  }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateCategory: (
    id: string,
    category: {
      name: string;
      type: "INCOME" | "EXPENSE";
      color: string;
      icon?: string;
    },
  ) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined,
);

export function TransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dateRange } = useDateRange();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      const searchParams = new URLSearchParams({
        from: dateRange.start.toISOString(),
        to: dateRange.end.toISOString(),
      });

      const response = await fetch(`/api/transactions?${searchParams}`);
      const data = await response.json();
      setAllTransactions(data);
      setFilteredTransactions(data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    }
  }, [dateRange]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, [fetchCategories, fetchTransactions]);

  const filterTransactions = useCallback(
    async (filters: {
      from?: string;
      to?: string;
      type?: string;
      category?: string;
    }) => {
      try {
        console.log("Aplicando filtros no contexto:", filters);

        const params = new URLSearchParams();
        if (filters.from) params.set("from", filters.from);
        if (filters.to) params.set("to", filters.to);
        if (filters.type) params.set("type", filters.type);
        if (filters.category) params.set("category", filters.category);

        const queryString = params.toString();
        const url = `/api/transactions${queryString ? `?${queryString}` : ""}`;

        console.log("URL da requisição:", url);

        const response = await fetch(url);
        if (!response.ok) throw new Error("Falha ao buscar transações");

        const data = await response.json();
        console.log("Transações filtradas:", data.length);

        setFilteredTransactions(data);
      } catch (error) {
        console.error("Erro ao filtrar transações:", error);
        throw error;
      }
    },
    [],
  );

  const addTransaction = useCallback(
    async (transaction: Omit<Transaction, "id">) => {
      try {
        const response = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transaction),
        });
        if (!response.ok) throw new Error("Failed to add transaction");
        await fetchTransactions();
      } catch (error) {
        console.error("Error adding transaction:", error);
        throw error;
      }
    },
    [fetchTransactions],
  );

  const updateTransaction = useCallback(
    async (id: string, transaction: Partial<Transaction>) => {
      try {
        const response = await fetch(`/api/transactions/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            description: transaction.description,
            amount: transaction.amount,
            date: transaction.date,
            type: transaction.type,
            categoryId: transaction.categoryId,
          }),
        });

        if (response.status === 404) {
          throw new Error("Categoria não encontrada");
        }

        if (!response.ok) {
          throw new Error("Failed to update transaction");
        }

        await fetchTransactions();
      } catch (error) {
        console.error("Error updating transaction:", error);
        throw error;
      }
    },
    [fetchTransactions],
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/transactions/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete transaction");
        await fetchTransactions();
      } catch (error) {
        console.error("Error deleting transaction:", error);
        throw error;
      }
    },
    [fetchTransactions],
  );

  const createCategory = useCallback(
    async (category: {
      name: string;
      type: "INCOME" | "EXPENSE";
      color: string;
      icon?: string;
    }) => {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });

      if (!response.ok) throw new Error("Falha ao criar categoria");
      await fetchCategories();
    },
    [fetchCategories],
  );

  const deleteCategory = useCallback(
    async (categoryId: string) => {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Falha ao excluir categoria");
      await fetchCategories();
    },
    [fetchCategories],
  );

  const updateCategory = useCallback(
    async (
      categoryId: string,
      category: {
        name: string;
        type: "INCOME" | "EXPENSE";
        color: string | null;
        icon?: string | null;
      },
    ) => {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });
      if (!response.ok) throw new Error("Falha ao atualizar categoria");
      await fetchCategories();
    },
    [fetchCategories],
  );

  return (
    <TransactionsContext.Provider
      value={{
        transactions: filteredTransactions,
        categories,
        filterTransactions,
        isLoading,
        refreshTransactions: fetchTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        createCategory,
        deleteCategory,
        updateCategory,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionsProvider",
    );
  }
  return context;
};
