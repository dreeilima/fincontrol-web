"use client";

import React, { useCallback, useEffect, useState } from "react";
import type { categories } from "@prisma/client"; // Update this line
import {
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DynamicIcon } from "@/components/ui/dynamic-icon";

import { CategoryDialog } from "./category-dialog";

function CategoryCard({
  category,
  onEdit,
  onDelete,
}: {
  category: categories; // Update this type
  onEdit: (category: categories) => void; // Update this type
  onDelete: (categoryId: string) => void;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-lg border p-3"
      style={{
        borderLeftColor: category.color || "#000000",
        borderLeftWidth: 4,
      }}
    >
      <div className="flex items-center gap-3">
        <DynamicIcon name={category.icon ?? null} size={20} />
        <p className="font-medium">{category.name}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(category)}>
            <PencilIcon className="mr-2 size-4" />
            <span>Editar</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(category.id)}
            className="text-destructive"
          >
            <TrashIcon className="mr-2 size-4" />
            <span>Excluir</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function CategoriesList() {
  const [categories, setCategories] = useState<categories[]>([]); // Update this type
  const [editingCategory, setEditingCategory] = useState<categories | null>(
    null,
  ); // Update this type

  const fetchCategories = useCallback(async () => {
    const response = await fetch("/api/categories");
    const data = await response.json();
    setCategories(data);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleEdit = (category: categories) => {
    setEditingCategory(category);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast.success("Categoria excluída com sucesso!");
      fetchCategories();
    } catch {
      toast.error("Erro ao excluir categoria");
    }
  };

  const incomeCategories = categories.filter((c) => c.type === "INCOME");
  const expenseCategories = categories.filter((c) => c.type === "EXPENSE");

  return (
    <div className="grid gap-6">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium text-muted-foreground">Receitas</h3>
          <CategoryDialog type="INCOME" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {incomeCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium text-muted-foreground">Despesas</h3>
          <CategoryDialog type="EXPENSE" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {expenseCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {editingCategory && (
        <CategoryDialog
          type={editingCategory.type as "INCOME" | "EXPENSE"}
          category={editingCategory}
          open={true}
          onOpenChange={(open) => !open && setEditingCategory(null)}
          onSuccess={() => {
            setEditingCategory(null);
            fetchCategories();
          }}
        />
      )}
    </div>
  );
}
