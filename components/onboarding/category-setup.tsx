"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const defaultCategories = [
  { name: "Alimentação", type: "EXPENSE", color: "#FF5733", icon: "🍽️" },
  { name: "Transporte", type: "EXPENSE", color: "#33FF57", icon: "🚗" },
  { name: "Moradia", type: "EXPENSE", color: "#3357FF", icon: "🏠" },
  { name: "Salário", type: "INCOME", color: "#57FF33", icon: "💰" },
  { name: "Freelance", type: "INCOME", color: "#FF3357", icon: "💼" },
];

export function CategorySetup({ onNext }: { onNext: () => void }) {
  const [categories, setCategories] = useState(defaultCategories);
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "EXPENSE",
    color: "#000000",
    icon: "📁",
  });

  const handleAddCategory = async () => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        setCategories([...categories, newCategory]);
        setNewCategory({
          name: "",
          type: "EXPENSE",
          color: "#000000",
          icon: "📁",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveAndContinue = async () => {
    // Aqui você pode adicionar lógica adicional se necessário
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category, index) => (
          <Card key={index} className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </div>
            <span
              className="size-4 rounded-full"
              style={{ backgroundColor: category.color }}
            />
          </Card>
        ))}
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Nome</Label>
            <Input
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Tipo</Label>
            <Select
              value={newCategory.type}
              onValueChange={(value) =>
                setNewCategory({ ...newCategory, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXPENSE">Despesa</SelectItem>
                <SelectItem value="INCOME">Receita</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleAddCategory} className="w-full">
          <Plus className="mr-2 size-4" />
          Adicionar Categoria
        </Button>

        <Button onClick={handleSaveAndContinue} className="w-full">
          Continuar
        </Button>
      </div>
    </div>
  );
}
