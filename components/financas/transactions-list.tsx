"use client";

import { useEffect, useState } from "react";
import { useTransactions } from "@/contexts/transactions-context";
import { transactions } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

import { cn, formatCurrency } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { Skeleton } from "@/components/ui/skeleton";

import { TransactionForm } from "./transaction-form";

export function TransactionsList() {
  const { transactions, refreshTransactions } = useTransactions();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] =
    useState<transactions | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        setIsLoading(true);
        await refreshTransactions();
      } finally {
        setIsLoading(false);
      }
    }

    loadTransactions();
  }, [refreshTransactions]);

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast.success("Transação excluída com sucesso!");
      refreshTransactions();
    } catch {
      toast.error("Erro ao excluir transação");
    } finally {
      setDeleteId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="size-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-[200px]" />
                <Skeleton className="h-4 w-[120px]" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="space-y-2 text-right">
                <Skeleton className="ml-auto h-5 w-[100px]" />
                <Skeleton className="ml-auto h-4 w-[80px]" />
              </div>
              <Skeleton className="size-8" /> {/* Menu button */}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
        <p className="text-sm text-muted-foreground">
          Nenhuma transação encontrada.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <DynamicIcon
                  name={transaction.categories?.icon ?? null}
                  size={24}
                />
              </div>
              <div>
                <p className="font-medium">
                  {transaction.description || transaction.categories?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(transaction.date), "PPP", { locale: ptBR })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p
                  className={cn(
                    "font-medium",
                    transaction.type === "INCOME"
                      ? "text-emerald-500"
                      : "text-rose-500",
                  )}
                >
                  {transaction.type === "INCOME" ? "+" : "-"}{" "}
                  {formatCurrency(Number(transaction.amount))}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.categories?.name}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setEditingTransaction(transaction as any)}
                  >
                    <Pencil className="mr-2 size-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => setDeleteId(transaction.id)}
                  >
                    <Trash className="mr-2 size-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={!!editingTransaction}
        onOpenChange={() => setEditingTransaction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Transação</DialogTitle>
          </DialogHeader>
          {editingTransaction && (
            <TransactionForm
              type={editingTransaction.type as "INCOME" | "EXPENSE"}
              transaction={editingTransaction}
              onSuccess={() => {
                setEditingTransaction(null);
                refreshTransactions();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta transação? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
