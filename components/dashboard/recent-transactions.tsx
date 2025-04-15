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
  const [isLoading, setIsLoading] = useState(true);

  const recentTransactions = useMemo(() => {
    try {
      // Cria um Map para evitar duplicatas
      const transactionGroups = new Map();

      transactions.forEach((transaction) => {
        const key = `${transaction.description}-${transaction.date}-${transaction.amount}`;

        // Se já existe uma transação com a mesma chave, só atualiza se for mais recente
        if (
          !transactionGroups.has(key) ||
          new Date(transaction.created_at) >
            new Date(transactionGroups.get(key).created_at)
        ) {
          transactionGroups.set(key, transaction);
        }
      });

      // Converte o Map para array e ordena
      const filtered = Array.from(transactionGroups.values())
        .sort((a, b) => {
          // Converte as datas para objetos Date uma única vez
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          const now = new Date();

          // Calcula a diferença em milissegundos
          const diffA = Math.abs(now.getTime() - dateA.getTime());
          const diffB = Math.abs(now.getTime() - dateB.getTime());

          // Ordena pela menor diferença (mais recente primeiro)
          if (diffA !== diffB) {
            return diffA - diffB;
          }

          // Se as datas forem igualmente distantes, usa created_at como desempate
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        })
        .slice(0, 8); // Aumentando de 5 para 8 transações exibidas

      return filtered;
    } catch (error) {
      console.error("Erro ao buscar transações recentes:", error);
      return [];
    }
  }, [transactions]);

  // Remove loading state quando as transações estiverem disponíveis
  useEffect(() => {
    if (transactions) {
      setIsLoading(false);
    }
  }, [transactions]);

  if (isLoading) {
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
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="size-4 animate-pulse rounded-full bg-muted" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 animate-pulse rounded-md bg-muted" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="h-4 w-28 animate-pulse rounded-md bg-muted" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
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
          {recentTransactions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                Nenhuma transação encontrada
              </TableCell>
            </TableRow>
          ) : (
            recentTransactions.map((transaction) => (
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
                  {formatCurrency(Math.abs(Number(transaction.amount)))}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="flex items-center gap-1.5">
                    {transaction.categories?.icon}
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
