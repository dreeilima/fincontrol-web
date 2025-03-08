"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionForm } from "@/components/financas/transaction-form";

export function QuickActions() {
  return (
    <div className="flex flex-col gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            <PlusIcon className="mr-2 size-4" />
            Nova Receita
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Receita</DialogTitle>
          </DialogHeader>
          <TransactionForm type="INCOME" />
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <PlusIcon className="mr-2 size-4" />
            Nova Despesa
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Despesa</DialogTitle>
          </DialogHeader>
          <TransactionForm type="EXPENSE" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
