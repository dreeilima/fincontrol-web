"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal, PlusCircle } from "lucide-react";

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
                <TableCell>
                  {category.icon && (
                    <DynamicIcon
                      name={category.icon}
                      className="size-4 text-muted-foreground"
                    />
                  )}
                </TableCell>
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
                      <DropdownMenuItem>Editar Categoria</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
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
    </div>
  );
}
