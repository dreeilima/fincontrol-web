"use client";

import { useEffect, useState } from "react";
import { UserRole } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CheckCircle2,
  MoreHorizontal,
  Trash2,
  UserCog,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { EditUserDialog } from "./edit-user-dialog";
import { TableSkeleton } from "./skeletons/metrics-skeleton";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string | Date;
  _count: {
    transactions: number;
    categories: number;
  };
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");

      if (!response.ok) throw new Error();

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser(userId: string) {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast.success("Usuário excluído com sucesso");
      fetchUsers(); // Recarrega a lista
    } catch (error) {
      toast.error("Erro ao excluir usuário");
    }
  }

  if (loading) return <TableSkeleton />;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Cadastro</TableHead>
            <TableHead className="text-center">Transações</TableHead>
            <TableHead className="text-center">Categorias</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.name || "Sem nome"}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge
                  variant={user.role === "ADMIN" ? "default" : "secondary"}
                >
                  {user.role === "ADMIN" ? "Admin" : "Usuário"}
                </Badge>
              </TableCell>
              <TableCell>
                {user.is_active ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-green-500" />
                    <span className="text-sm">Ativo</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <XCircle className="size-4 text-red-500" />
                    <span className="text-sm">Inativo</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {user.created_at
                  ? format(new Date(user.created_at), "dd/MM/yyyy", {
                      locale: ptBR,
                    })
                  : "Data indisponível"}
              </TableCell>
              <TableCell className="text-center">
                {user._count.transactions}
              </TableCell>
              <TableCell className="text-center">
                {user._count.categories}
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
                    <EditUserDialog user={user} onSuccess={fetchUsers} />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Excluir Usuário
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
