"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransactions } from "@/contexts/transactions-context";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, FilterIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TransactionsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, fetchTransactions, fetchSummaryTransactions } =
    useTransactions();

  const [date, setDate] = useState<DateRange | undefined>({
    from: searchParams.get("from")
      ? new Date(searchParams.get("from")!)
      : undefined,
    to: searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined,
  });
  const [type, setType] = useState<string>(searchParams.get("type") || "all");
  const [category, setCategory] = useState<string>(
    searchParams.get("category") || "all",
  );

  // Filtra as categorias baseado no tipo selecionado
  const filteredCategories = useMemo(() => {
    if (type === "all") return categories;
    return categories.filter((cat) => cat.type === type);
  }, [categories, type]);

  const handleFilter = useCallback(
    (key: string, value: string) => {
      console.log("handleFilter chamado:", { key, value });
      const params = new URLSearchParams(searchParams);
      if (value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      console.log("Novos parâmetros:", params.toString());
      router.push(`/dashboard/financas?${params.toString()}`);
    },
    [searchParams, router],
  );

  const clearFilters = () => {
    setDate(undefined);
    setType("all");
    setCategory("all");
    router.push("/dashboard/financas");
    Promise.all([fetchTransactions({}), fetchSummaryTransactions({})]); // Clear filters in context
  };

  // Aplica filtros quando os valores mudam
  useEffect(() => {
    const filters = {
      from: date?.from ? format(date.from, "yyyy-MM-dd") : undefined,
      to: date?.to ? format(date.to, "yyyy-MM-dd") : undefined,
      type: type !== "all" ? type : undefined,
      category: category !== "all" ? category : undefined,
    };

    console.log("Aplicando filtros:", {
      filters,
      currentType: type,
      currentCategory: category,
      selectedCategory: categories.find((c) => c.id === category),
    });

    // Atualiza a lista de transações com paginação
    fetchTransactions(filters);

    // Atualiza o resumo com todos os filtros
    fetchSummaryTransactions(filters);
  }, [date, type, category, fetchTransactions, fetchSummaryTransactions]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "dd/MM/yyyy")} -{" "}
                        {format(date.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(date.from, "dd/MM/yyyy")
                    )
                  ) : (
                    "Selecione um período"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={type}
              onValueChange={(value) => {
                setType(value);
                setCategory("all"); // Reset categoria ao mudar tipo
                handleFilter("type", value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="INCOME">Receitas</SelectItem>
                <SelectItem value="EXPENSE">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={category}
              onValueChange={(value) => {
                console.log("Categoria selecionada:", {
                  value,
                  categoria: categories.find((c) => c.id === value),
                });
                setCategory(value);
                handleFilter("category", value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {filteredCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" onClick={clearFilters}>
              Limpar
            </Button>
            <Button
              onClick={() => {
                // Implement the filter button action
              }}
            >
              <FilterIcon className="mr-2 size-4" />
              Filtrar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
