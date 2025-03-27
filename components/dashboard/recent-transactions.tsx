"use client";

import { useEffect, useMemo, useState } from "react";
import { useDateRange } from "@/contexts/date-range-context";
import { useTransactions } from "@/contexts/transactions-context";
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
  const { transactions } = useTransactions();
  const { dateRange } = useDateRange();
  const [isLoading, setIsLoading] = useState(true);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(
        (t) =>
          new Date(t.date) >= dateRange.start &&
          new Date(t.date) <= dateRange.end,
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5); // Últimas 5 transações
  }, [transactions, dateRange]);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const response = await fetch("/api/transactions?limit=5");
        const data = await response.json();
        // setTransactions(data);
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
          {filteredTransactions.map((transaction) => (
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
                {formatCurrency(Number(transaction.amount))}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="flex items-center gap-1.5">
                  {transaction.categories.icon}
                  <span className="text-muted-foreground">
                    {transaction.category}
                  </span>
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
