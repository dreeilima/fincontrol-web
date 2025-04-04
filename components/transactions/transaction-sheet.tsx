"use client";

import { useEffect, useState } from "react";
import { useTransactions } from "@/contexts/transactions-context";

import { Transaction } from "@/types/transaction";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { TransactionForm } from "./transaction-form";

interface TransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string | null;
}

export function TransactionSheet({
  open,
  onOpenChange,
  transactionId,
}: TransactionSheetProps) {
  const { transactions } = useTransactions();
  const [transaction, setTransaction] = useState<Transaction | undefined>();

  useEffect(() => {
    if (transactionId) {
      const foundTransaction = transactions.find((t) => t.id === transactionId);
      if (foundTransaction) {
        setTransaction({
          ...foundTransaction,
          amount: String(foundTransaction.amount),
          date: foundTransaction.date.split("T")[0],
          categoryId: foundTransaction.categoryId,
        });
      }
    } else {
      setTransaction(undefined);
    }
  }, [transactionId, transactions]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>
            {transactionId ? "Editar Transação" : "Nova Transação"}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <TransactionForm
            onSuccess={() => onOpenChange(false)}
            transaction={transaction}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
