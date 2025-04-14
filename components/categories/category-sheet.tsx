"use client";

import { useTransactions } from "@/contexts/transactions-context";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { CategoryForm } from "./category-form";

interface CategorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: {
    id: string;
    name: string;
    type: "INCOME" | "EXPENSE";
    color: string | null;
    icon?: string | null;
  };
}

export function CategorySheet({
  open,
  onOpenChange,
  category,
}: CategorySheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {category ? "Editar Categoria" : "Nova Categoria"}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8">
          <CategoryForm
            category={category}
            onSuccess={() => onOpenChange(false)}
            isSheet={true}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
