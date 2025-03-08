"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TableSkeleton } from "./skeletons/metrics-skeleton";

interface TopUser {
  id: string;
  name: string;
  email: string;
  totalTransactions: number;
  totalAmount: number;
  lastActivity: Date;
}

export function TopUsersTable() {
  const [users, setUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopUsers() {
      try {
        const response = await fetch("/api/admin/users/top");
        if (!response.ok) throw new Error("Falha ao carregar usuários");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopUsers();
  }, []);

  if (loading) return <TableSkeleton />;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Transações</TableHead>
            <TableHead>Volume Total</TableHead>
            <TableHead>Última Atividade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.totalTransactions}</TableCell>
              <TableCell>{formatCurrency(user.totalAmount)}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(user.lastActivity), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
