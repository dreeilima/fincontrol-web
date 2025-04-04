"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { endOfMonth, startOfMonth } from "date-fns";

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
  summaryTransactions: Transaction[];
  categories: Category[];
  isLoading: boolean;
  fetchTransactions: (filters?: {
    from?: string;
    to?: string;
    type?: string;
    category?: string;
  }) => Promise<void>;
  fetchSummaryTransactions: (filters?: {
    from?: string;
    to?: string;
    type?: string;
    category?: string;
  }) => Promise<void>;
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summaryTransactions, setSummaryTransactions] = useState<Transaction[]>(
    [],
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTransactions = useCallback(
    async (
      filters: {
        from?: string;
        to?: string;
        type?: string;
        category?: string;
      } = {},
    ) => {
      try {
        setIsLoading(true);
        const startDate = filters.from
          ? new Date(filters.from)
          : startOfMonth(new Date());
        const endDate = filters.to
          ? new Date(filters.to)
          : endOfMonth(new Date());

        const searchParams = new URLSearchParams({
          from: startDate.toISOString(),
          to: endDate.toISOString(),
          limit: "1000",
        });

        if (filters.type) searchParams.set("type", filters.type);
        if (filters.category) searchParams.set("category", filters.category);

        const response = await fetch(`/api/transactions?${searchParams}`);
        const data = await response.json();

        setTransactions(data.transactions);
        return data;
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const fetchSummaryTransactions = useCallback(
    async (
      filters: {
        from?: string;
        to?: string;
        type?: string;
        category?: string;
      } = {},
    ) => {
      try {
        const startDate = filters.from
          ? new Date(filters.from)
          : startOfMonth(new Date());
        const endDate = filters.to
          ? new Date(filters.to)
          : endOfMonth(new Date());

        // Ajusta as datas para o início e fim do dia em UTC
        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(23, 59, 59, 999);

        const searchParams = new URLSearchParams({
          from: startDate.toISOString(),
          to: endDate.toISOString(),
          limit: "1000",
        });

        if (filters.type && filters.type !== "all") {
          searchParams.set("type", filters.type);
        }
        if (filters.category && filters.category !== "all") {
          searchParams.set("category", filters.category);
        }

        const response = await fetch(`/api/transactions?${searchParams}`);
        const data = await response.json();

        setSummaryTransactions(data.transactions);
        return data;
      } catch (error) {
        console.error("Erro ao buscar transações do resumo:", error);
        throw error;
      }
    },
    [],
  );

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  // Busca inicial de categorias e transações do mês atual
  useEffect(() => {
    fetchCategories();
    fetchTransactions();
    fetchSummaryTransactions();
  }, [fetchTransactions, fetchSummaryTransactions]);

  const addTransaction = useCallback(
    async (transaction: Omit<Transaction, "id">) => {
      try {
        const response = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transaction),
        });
        if (!response.ok) throw new Error("Failed to add transaction");

        // Atualiza a lista e o resumo com os filtros atuais
        const currentFilters: {
          from: string;
          to: string;
          type?: string;
          category?: string;
        } = {
          from: dateRange.start.toISOString(),
          to: dateRange.end.toISOString(),
        };

        // Pega os filtros da URL
        const searchParams = new URLSearchParams(window.location.search);
        const type = searchParams.get("type");
        const category = searchParams.get("category");

        if (type && type !== "all") currentFilters.type = type;
        if (category && category !== "all") currentFilters.category = category;

        console.log(
          "Atualizando após adicionar transação com filtros:",
          currentFilters,
        );

        await Promise.all([
          fetchTransactions(currentFilters),
          fetchSummaryTransactions(currentFilters),
        ]);
      } catch (error) {
        console.error("Error adding transaction:", error);
        throw error;
      }
    },
    [fetchTransactions, fetchSummaryTransactions, dateRange],
  );

  const updateTransaction = useCallback(
    async (id: string, transaction: Partial<Transaction>) => {
      try {
        const response = await fetch(`/api/transactions/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transaction),
        });
        if (!response.ok) throw new Error("Failed to update transaction");

        // Atualiza a lista e o resumo com os filtros atuais
        const currentFilters = {
          from: dateRange.start.toISOString(),
          to: dateRange.end.toISOString(),
        };

        await Promise.all([
          fetchTransactions(currentFilters),
          fetchSummaryTransactions(currentFilters),
        ]);
      } catch (error) {
        console.error("Error updating transaction:", error);
        throw error;
      }
    },
    [fetchTransactions, fetchSummaryTransactions, dateRange],
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/transactions/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete transaction");

        // Atualiza a lista e o resumo com os filtros atuais
        const currentFilters = {
          from: dateRange.start.toISOString(),
          to: dateRange.end.toISOString(),
        };

        await Promise.all([
          fetchTransactions(currentFilters),
          fetchSummaryTransactions(currentFilters),
        ]);
      } catch (error) {
        console.error("Error deleting transaction:", error);
        throw error;
      }
    },
    [fetchTransactions, fetchSummaryTransactions, dateRange],
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

  const refreshTransactions = useCallback(async () => {
    await Promise.all([fetchTransactions(), fetchSummaryTransactions()]);
  }, [fetchTransactions, fetchSummaryTransactions]);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        summaryTransactions,
        categories,
        isLoading,
        fetchTransactions,
        fetchSummaryTransactions,
        refreshTransactions,
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
