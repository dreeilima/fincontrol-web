"use client";

import { useEffect, useState } from "react";
import { icons, MoreHorizontal, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

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
  Dialog,
  DialogContent,
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
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DefaultCategoryForm } from "./default-category-form";
import { EditCategoryDialog } from "./edit-category-dialog";
import { TableSkeleton } from "./skeletons/metrics-skeleton";

interface Category {
  id: string;
  name: string;
  type: string;
  color: string | null;
  icon: string | null;
  _count: {
    transactions: number;
  };
}

export function DefaultCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) throw new Error("Falha ao carregar categorias");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleDeleteCategory(categoryId: string) {
    setIsDeleteLoading(true);

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast.success("Categoria excluída com sucesso");
      fetchCategories(); // Recarrega a lista
    } catch (error) {
      toast.error("Erro ao excluir categoria");
    } finally {
      setIsDeleteLoading(false);
      setCategoryToDelete(null);
    }
  }

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Categorias Padrão</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 size-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Categoria Padrão</DialogTitle>
            </DialogHeader>
            <DefaultCategoryForm onSuccess={fetchCategories} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Cor</TableHead>
              <TableHead>Ícone</TableHead>
              <TableHead>Transações</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      category.type === "INCOME" ? "default" : "secondary"
                    }
                  >
                    {category.type === "INCOME" ? "Receita" : "Despesa"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div
                    className="size-4 rounded-full"
                    style={{ backgroundColor: category.color || "#000000" }}
                  />
                </TableCell>
                <TableCell>{category.icon}</TableCell>
                <TableCell>{category._count.transactions}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="size-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <EditCategoryDialog
                        category={{
                          id: category.id,
                          name: category.name,
                          type: category.type as "INCOME" | "EXPENSE",
                          color: category.color || "#000000",
                          icon: category.icon || "",
                        }}
                        onSuccess={fetchCategories}
                      />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setCategoryToDelete(category.id)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Excluir Categoria
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={() => setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente
              esta categoria e pode afetar transações relacionadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                categoryToDelete && handleDeleteCategory(categoryToDelete)
              }
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleteLoading}
            >
              {isDeleteLoading ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Excluindo...</span>
                </>
              ) : (
                "Sim, excluir categoria"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
