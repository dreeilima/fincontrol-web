"use client";

import { categories } from "@prisma/client";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CategoryForm } from "./category-form";

interface CategoryDialogProps {
  type: "INCOME" | "EXPENSE";
  category?: categories;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CategoryDialog({
  type,
  category,
  open,
  onOpenChange,
  onSuccess,
}: CategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon className="mr-2 size-4" />
          Nova {type === "INCOME" ? "Receita" : "Despesa"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Editar" : "Nova"} Categoria de{" "}
            {type === "INCOME" ? "Receita" : "Despesa"}
          </DialogTitle>
        </DialogHeader>
        <CategoryForm type={type} category={category} onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
}
