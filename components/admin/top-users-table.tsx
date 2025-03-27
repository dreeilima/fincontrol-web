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
  lastActivity: string | null;
}

export function TopUsersTable() {
  const [users, setUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopUsers() {
      try {
        const response = await fetch("/api/admin/users/top");
        if (!response.ok) throw new Error();
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

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Total Transações</TableHead>
            <TableHead>Total Movimentado</TableHead>
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
                {user.lastActivity
                  ? formatDistanceToNow(new Date(user.lastActivity), {
                      addSuffix: true,
                      locale: ptBR,
                    })
                  : "Nunca"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
