"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { BankAccount, Category, Transaction } from "@prisma/client";

interface TransactionWithRelations extends Transaction {
  category: Category | null;
  bankAccount: BankAccount | null;
}

interface TransactionsContextType {
  transactions: TransactionWithRelations[];
  addTransaction: (transaction: TransactionWithRelations) => void;
  refreshTransactions: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
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

  const refreshTransactions = useCallback(async () => {
    const response = await fetch("/api/transactions");
    const data = await response.json();
    setTransactions(data);
  }, []);

  const addTransaction = useCallback(
    (transaction: TransactionWithRelations) => {
      setTransactions((prev) => [transaction, ...prev]);
    },
    [],
  );

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch("/api/transactions");
      if (!response.ok) throw new Error("Erro ao buscar transações");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    }
  }, []);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        addTransaction,
        refreshTransactions,
        fetchTransactions,
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
