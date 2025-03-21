"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

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
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined,
);

export function TransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Move refreshTransactions to be defined before it's used
  const refreshTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/transactions");
      const data = await response.json();
      setAllTransactions(data);
      setFilteredTransactions(data);
    } catch (error) {
      console.error("Error refreshing transactions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  // Move useEffect after both functions are defined
  useEffect(() => {
    fetchCategories();
    refreshTransactions();
  }, [fetchCategories, refreshTransactions]);

  const filterTransactions = useCallback(
    (filters: {
      from?: string;
      to?: string;
      type?: string;
      category?: string;
    }) => {
      let result = [...allTransactions];

      if (filters.from || filters.to) {
        result = result.filter((t) => {
          const transactionDate = new Date(t.date);
          const fromDate = filters.from ? new Date(filters.from) : null;
          const toDate = filters.to ? new Date(filters.to + "T23:59:59") : null;

          if (fromDate && toDate) {
            return transactionDate >= fromDate && transactionDate <= toDate;
          } else if (fromDate) {
            return transactionDate >= fromDate;
          } else if (toDate) {
            return transactionDate <= toDate;
          }
          return true;
        });
      }

      if (filters.type && filters.type !== "all") {
        result = result.filter((t) => t.type === filters.type);
      }

      if (filters.category && filters.category !== "all") {
        result = result.filter((t) => t.category === filters.category);
      }

      setFilteredTransactions(result);
    },
    [allTransactions],
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
        await refreshTransactions();
      } catch (error) {
        console.error("Error adding transaction:", error);
        throw error;
      }
    },
    [refreshTransactions],
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

        await refreshTransactions();
      } catch (error) {
        console.error("Error updating transaction:", error);
        throw error;
      }
    },
    [refreshTransactions],
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/transactions/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete transaction");
        await refreshTransactions();
      } catch (error) {
        console.error("Error deleting transaction:", error);
        throw error;
      }
    },
    [refreshTransactions],
  );

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  return (
    <TransactionsContext.Provider
      value={{
        transactions: filteredTransactions,
        categories,
        filterTransactions, // Now we can include it here
        isLoading,
        refreshTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
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
