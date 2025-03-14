"use client";

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
  isEditing: boolean;
  transaction?: Transaction;
}

export function TransactionSheet({
  open,
  onOpenChange,
  isEditing,
  transaction,
}: TransactionSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Editar Transação" : "Nova Transação"}
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
