"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTransactions } from "@/contexts/transactions-context";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { Transaction } from "@/types/transaction";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

import { TransactionSheet } from "./transaction-sheet";

export function TransactionsList() {
  const { transactions, isLoading, deleteTransaction, categories } =
    useTransactions();
  const { toast } = useToast();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<string | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null,
  );

  // Update the category label function
  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || categoryId;
  };

  // Função para formatar a data corretamente
  const formatTransactionDate = (dateString: string) => {
    console.log("Data recebida para formatação:", dateString);

    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      console.log("Data já está no formato correto:", dateString);
      return dateString;
    }

    const date = new Date(dateString);
    const formatted = format(date, "yyyy-MM-dd");
    console.log("Data após formatação:", {
      original: dateString,
      formatted: formatted,
    });

    return formatted;
  };

  const handleEdit = (id: string) => {
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) {
      toast({
        variant: "destructive",
        title: "Erro ao editar transação",
        description: "Transação não encontrada.",
      });
      return;
    }
    setEditingTransaction(transaction.id);
    setSheetOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete) return;
    try {
      await deleteTransaction(transactionToDelete);
      toast({
        title: "Transação excluída",
        description: "A transação foi excluída com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir transação",
        description:
          "Ocorreu um erro ao excluir a transação. Tente novamente mais tarde.",
      });
    } finally {
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-4" />
                    <Skeleton className="h-4 w-[250px]" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-4 w-[100px]" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto size-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhuma transação encontrada.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {transaction.type === "INCOME" ? (
                        <ArrowUpIcon className="mr-2 size-4 text-green-500" />
                      ) : (
                        <ArrowDownIcon className="mr-2 size-4 text-red-500" />
                      )}
                      {transaction.description}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">
                      {getCategoryLabel(transaction.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {(() => {
                      // Ajusta o timezone adicionando 3 horas para compensar UTC-3
                      const date = new Date(transaction.date);
                      date.setHours(date.getHours() + 3);

                      return format(date, "dd/MM/yyyy", { locale: ptBR });
                    })()}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-medium",
                      transaction.type === "INCOME"
                        ? "text-green-500"
                        : "text-red-500",
                    )}
                  >
                    {formatCurrency(Number(transaction.amount))}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="size-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleEdit(transaction.id)}
                        >
                          <Pencil className="mr-2 size-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(transaction.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 size-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta transação? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <TransactionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        isEditing={!!editingTransaction}
        transaction={
          editingTransaction
            ? (() => {
                console.log(
                  "ID da transação sendo editada:",
                  editingTransaction,
                );

                const transaction = transactions.find(
                  (t) => t.id === editingTransaction,
                )!;

                console.log("Transação encontrada:", transaction);

                const formattedTransaction = {
                  ...transaction,
                  amount: String(transaction.amount),
                  date: transaction.date.split("T")[0],
                  categoryId: transaction.categoryId,
                  categories: transaction.categories,
                };

                console.log("Transação formatada:", formattedTransaction);

                return formattedTransaction;
              })()
            : undefined
        }
      />
    </>
  );
}
