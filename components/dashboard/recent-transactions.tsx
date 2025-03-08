"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  TagIcon,
} from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description: string;
  categoryName: string;
  date: string;
}

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const response = await fetch("/api/transactions?limit=5");
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTransactions();
  }, []);

  if (isLoading) {
    return <div className="h-[200px] animate-pulse rounded-md bg-muted" />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead className="hidden md:table-cell">Categoria</TableHead>
            <TableHead className="hidden md:table-cell">Descrição</TableHead>
            <TableHead className="hidden md:table-cell">Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {transaction.type === "INCOME" ? (
                  <ArrowUpIcon className="size-4 text-green-500" />
                ) : (
                  <ArrowDownIcon className="size-4 text-red-500" />
                )}
              </TableCell>
              <TableCell
                className={
                  transaction.type === "INCOME"
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="flex items-center gap-1">
                  <TagIcon className="size-3 text-muted-foreground" />
                  {transaction.categoryName}
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {transaction.description}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="size-3 text-muted-foreground" />
                  {formatDistanceToNow(new Date(transaction.date), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
