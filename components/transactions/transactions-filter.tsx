"use client";

import { useEffect, useState } from "react";
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
  const { categories, filterTransactions } = useTransactions();

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

  useEffect(() => {
    // Apply filters whenever any filter value changes
    const filters = {
      from: date?.from ? format(date.from, "yyyy-MM-dd") : undefined,
      to: date?.to ? format(date.to, "yyyy-MM-dd") : undefined,
      type: type !== "all" ? type : undefined,
      category: category !== "all" ? category : undefined,
    };
    filterTransactions(filters);
  }, [date, type, category, filterTransactions]);

  const applyFilters = () => {
    // Update URL only when button is clicked
    const params = new URLSearchParams();
    if (date?.from) params.set("from", format(date.from, "yyyy-MM-dd"));
    if (date?.to) params.set("to", format(date.to, "yyyy-MM-dd"));
    if (type !== "all") params.set("type", type);
    if (category !== "all") params.set("category", category);

    router.push(`/dashboard/financas?${params.toString()}`);
  };

  const clearFilters = () => {
    setDate(undefined);
    setType("all");
    setCategory("all");
    router.push("/dashboard/financas");
    filterTransactions({}); // Clear filters in context
  };

  // Apply filters on mount and when URL params change
  useEffect(() => {
    const filters = {
      date: searchParams.get("date") || undefined,
      type: searchParams.get("type") || undefined,
      category: searchParams.get("category") || undefined,
    };
    filterTransactions(filters);
  }, [searchParams, filterTransactions]);

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
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de transação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas transações</SelectItem>
                <SelectItem value="INCOME">Receitas</SelectItem>
                <SelectItem value="EXPENSE">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {categories
                  .filter((cat) => type === "all" || cat.type === type)
                  .map((cat) => (
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
            <Button onClick={applyFilters}>
              <FilterIcon className="mr-2 size-4" />
              Filtrar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
