"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, MoreHorizontal, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DefaultCategoryForm } from "./default-category-form";
import { EditCategoryDialog } from "./edit-category-dialog";
import { TableSkeleton } from "./skeletons/metrics-skeleton";

interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  color: string | null;
  icon: string | null;
  is_default: boolean;
  _count: {
    transactions: number;
  };
}

export function DefaultCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isPropagateLoading, setIsPropagateLoading] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"income" | "expense">("income");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/admin/categories?t=${timestamp}`);

      if (!response.ok) throw new Error("Falha ao carregar categorias");

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      toast.error("Erro ao carregar categorias. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(
    (category) => category.type.toLowerCase() === activeTab,
  );

  async function handleDeleteCategory(categoryId: string) {
    setIsDeleteLoading(true);

    try {
      const timestamp = new Date().getTime();
      const response = await fetch(
        `/api/admin/categories/${categoryId}?t=${timestamp}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => null);
        throw new Error(errorText || "Falha ao excluir categoria");
      }

      toast.success("Categoria excluída com sucesso");
      fetchCategories();
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      toast.error("Erro ao excluir categoria. Tente novamente.");
    } finally {
      setIsDeleteLoading(false);
      setCategoryToDelete(null);
    }
  }

  async function propagateCategories() {
    setIsPropagateLoading(true);

    try {
      const response = await fetch("/api/admin/propagate-default-categories", {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Falha ao propagar categorias");
      }

      const result = await response.json();
      toast.success(result.message || "Categorias propagadas com sucesso!");
    } catch (error) {
      console.error("Erro ao propagar categorias:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao propagar categorias",
      );
    } finally {
      setIsPropagateLoading(false);
    }
  }

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Categorias Padrão
          </h2>
          <p className="text-sm text-muted-foreground">
            Gerencie as categorias padrão disponíveis para todos os usuários
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                setLoading(true);
                const response = await fetch(
                  "/api/admin/initialize-default-categories",
                  {
                    method: "POST",
                  },
                );

                if (!response.ok) {
                  throw new Error("Falha ao inicializar categorias");
                }

                const data = await response.json();
                toast.success(
                  data.message || "Categorias inicializadas com sucesso!",
                );
                fetchCategories();
              } catch (error) {
                console.error("Erro ao inicializar categorias:", error);
                toast.error("Erro ao inicializar categorias");
              } finally {
                setLoading(false);
              }
            }}
          >
            Inicializar Categorias
          </Button>
          <Button
            variant="secondary"
            onClick={propagateCategories}
            disabled={isPropagateLoading || categories.length === 0}
          >
            {isPropagateLoading ? (
              <>
                <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Propagando...</span>
              </>
            ) : (
              "Propagar para Usuários"
            )}
          </Button>
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
      </div>

      {categories.length === 0 ? (
        <div className="mt-4 flex h-[200px] flex-col items-center justify-center rounded-md border p-4 text-center">
          <div className="mb-2 text-4xl">📃</div>
          <h3 className="text-lg font-medium">
            Nenhuma categoria padrão encontrada
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Clique em "Inicializar Categorias" para criar as categorias padrão.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <Tabs
            defaultValue="income"
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "income" | "expense")
            }
          >
            <TabsList>
              <TabsTrigger value="income">Receitas</TabsTrigger>
              <TabsTrigger value="expense">Despesas</TabsTrigger>
            </TabsList>
            <TabsContent value="income" className="space-y-4">
              <div className="rounded-md border">
                <div className="border-b bg-muted/50 p-3">
                  <h3 className="flex items-center font-medium">
                    <Badge className="mr-2">Receitas</Badge>
                    Categorias de Receita
                  </h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Ícone</TableHead>
                      <TableHead>Cor</TableHead>
                      <TableHead>Transações</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          {category.name}
                        </TableCell>
                        <TableCell>{category.icon}</TableCell>
                        <TableCell>
                          <div
                            className="size-4 rounded-full"
                            style={{
                              backgroundColor: category.color || "#000",
                            }}
                          />
                        </TableCell>
                        <TableCell>{category._count.transactions}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="size-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <EditCategoryDialog
                                category={category}
                                onSuccess={fetchCategories}
                              />
                              <DropdownMenuItem
                                onClick={() => setCategoryToDelete(category.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 size-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="expense" className="space-y-4">
              <div className="rounded-md border">
                <div className="border-b bg-muted/50 p-3">
                  <h3 className="flex items-center font-medium">
                    <Badge className="mr-2">Despesas</Badge>
                    Categorias de Despesa
                  </h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Ícone</TableHead>
                      <TableHead>Cor</TableHead>
                      <TableHead>Transações</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          {category.name}
                        </TableCell>
                        <TableCell>{category.icon}</TableCell>
                        <TableCell>
                          <div
                            className="size-4 rounded-full"
                            style={{
                              backgroundColor: category.color || "#000",
                            }}
                          />
                        </TableCell>
                        <TableCell>{category._count.transactions}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="size-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <EditCategoryDialog
                                category={category}
                                onSuccess={fetchCategories}
                              />
                              <DropdownMenuItem
                                onClick={() => setCategoryToDelete(category.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 size-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={() => setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta categoria? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                categoryToDelete && handleDeleteCategory(categoryToDelete)
              }
              disabled={isDeleteLoading}
            >
              {isDeleteLoading ? (
                <>
                  <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Excluindo...</span>
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
