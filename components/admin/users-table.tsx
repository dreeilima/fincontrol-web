"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2Icon, ChevronDownIcon, XCircleIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Tipos
export interface User {
  id: string;
  name: string | null;
  email: string | null;
  plan: string;
  status?: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  _count: {
    transactions: number;
    categories: number;
  };
}

interface UsersTableProps {
  data: User[];
}

export function UsersTable({ data }: UsersTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("basic");

  const filteredUsers = data.filter((user) => {
    const matchesSearch =
      search === "" ||
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || user.isActive === (statusFilter === "ACTIVE");

    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = async (user: User) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          role: user.role,
          isActive: !user.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar status do usuário");
      }

      toast.success(
        `Usuário ${user.isActive ? "desativado" : "ativado"} com sucesso`,
      );
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar status do usuário");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePlan = async () => {
    if (!editingUser || isLoading) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/users/${editingUser.id}/plan`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: selectedPlan,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar plano do usuário");
      }

      toast.success("Plano atualizado com sucesso");
      setShowPlanDialog(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar plano do usuário");
    } finally {
      setIsLoading(false);
    }
  };

  const openPlanDialog = (user: User) => {
    setEditingUser(user);
    setSelectedPlan(user.plan);
    setShowPlanDialog(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ACTIVE">Ativos</SelectItem>
            <SelectItem value="INACTIVE">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle2Icon className="size-4" />
                        <span>Ativo</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-500">
                        <XCircleIcon className="size-4" />
                        <span>Inativo</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {user.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ChevronDownIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openPlanDialog(user)}>
                          Alterar Plano
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleToggleStatus(user)}
                          disabled={isLoading}
                        >
                          {user.isActive ? "Desativar" : "Ativar"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo para alterar plano */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Plano</DialogTitle>
            <DialogDescription>
              Selecione o novo plano para {editingUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Básico</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPlanDialog(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleChangePlan} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
