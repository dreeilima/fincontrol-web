"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { categories } from "@prisma/client";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PERIODS = [
  { value: "7", label: "Últimos 7 dias" },
  { value: "15", label: "Últimos 15 dias" },
  { value: "30", label: "Últimos 30 dias" },
  { value: "90", label: "Últimos 3 meses" },
  { value: "180", label: "Últimos 6 meses" },
  { value: "365", label: "Último ano" },
];

export function RelatorioFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<categories[]>([]);

  // Valores dos filtros
  const period = searchParams.get("period") || "30";
  const categoryId = searchParams.get("categoryId") || "all";

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    }

    loadCategories();
  }, []);

  function handleFilter() {
    const params = new URLSearchParams();
    if (period !== "30") params.set("period", period);
    if (categoryId !== "all") params.set("categoryId", categoryId);

    router.push(`/dashboard/relatorio?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Select
        value={period}
        onValueChange={(value) =>
          router.push(`/dashboard/relatorio?period=${value}`)
        }
      >
        <SelectTrigger className="w-[180px]">
          <CalendarIcon className="mr-2 size-4" />
          <SelectValue placeholder="Selecione o período" />
        </SelectTrigger>
        <SelectContent>
          {PERIODS.map((period) => (
            <SelectItem key={period.value} value={period.value}>
              {period.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={categoryId}
        onValueChange={(value) =>
          router.push(`/dashboard/relatorio?categoryId=${value}`)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione a categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={handleFilter}>
        Aplicar Filtros
      </Button>
    </div>
  );
}
