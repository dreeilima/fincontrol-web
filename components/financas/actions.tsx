"use client";

import { useState } from "react";
import { PlusIcon, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { CategoriesList } from "./categories-list";
import { TransactionForm } from "./transaction-form";

export function FinancasActions() {
  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon className="mr-2 size-4" />
            Nova Receita
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Receita</DialogTitle>
          </DialogHeader>
          <TransactionForm type="INCOME" />
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <PlusIcon className="mr-2 size-4" />
            Nova Despesa
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Despesa</DialogTitle>
          </DialogHeader>
          <TransactionForm type="EXPENSE" />
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost">
            <Settings2 className="mr-2 size-4" />
            Categorias
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="space-y-1">
            <DialogTitle>Gerenciar Categorias</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Gerencie suas categorias de receitas e despesas
            </p>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="mt-8">
              <CategoriesList />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
