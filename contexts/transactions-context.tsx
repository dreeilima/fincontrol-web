"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { bank_accounts, categories, transactions } from "@prisma/client";

interface TransactionWithRelations
  extends Omit<transactions, "category" | "bankAccount"> {
  categories: categories | null;
  bank_accounts: bank_accounts | null;
}

interface TransactionsContextType {
  transactions: TransactionWithRelations[];
  addTransaction: (transaction: TransactionWithRelations) => Promise<void>;
  refreshTransactions: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  isLoading: boolean;
}

export const TransactionsContext =
  createContext<TransactionsContextType | null>(null);

export function TransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useState<TransactionWithRelations[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  // Carrega as transações quando o componente é montado
  useEffect(() => {
    fetchTransactions();
  }, []);

  const refreshTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Erro ao atualizar transações:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTransaction = useCallback(
    async (transaction: TransactionWithRelations) => {
      try {
        // Atualiza o estado imediatamente para feedback instantâneo
        setTransactions((prev) => [transaction, ...prev]);

        // Atualiza os dados do servidor em segundo plano
        await refreshTransactions();
      } catch (error) {
        console.error("Erro ao adicionar transação:", error);
        // Reverte a atualização local em caso de erro
        setTransactions((prev) => prev.filter((t) => t.id !== transaction.id));
      }
    },
    [refreshTransactions],
  );

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/transactions");
      if (!response.ok) throw new Error("Erro ao buscar transações");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        addTransaction,
        refreshTransactions,
        fetchTransactions,
        isLoading,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (!context)
    throw new Error("useTransactions must be used within TransactionsProvider");
  return context;
}
