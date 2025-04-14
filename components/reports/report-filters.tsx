"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  endOfMonth,
  endOfYear,
  format,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, FilterIcon, XIcon } from "lucide-react";

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

export function ReportFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const today = new Date();
  const firstDayCurrentMonth = startOfMonth(today);

  const [startDate, setStartDate] = useState<Date | undefined>(
    searchParams.get("startDate")
      ? new Date(searchParams.get("startDate") as string)
      : firstDayCurrentMonth,
  );

  const [endDate, setEndDate] = useState<Date | undefined>(
    searchParams.get("endDate")
      ? new Date(searchParams.get("endDate") as string)
      : today,
  );

  const [period, setPeriod] = useState<string>(
    searchParams.get("period") || "current-month",
  );

  const handlePeriodChange = (value: string) => {
    setPeriod(value);

    const today = new Date();
    let start: Date;
    let end: Date;

    switch (value) {
      case "current-month":
        start = startOfMonth(today);
        end = today;
        break;
      case "last-month":
        const lastMonth = subMonths(today, 1);
        start = startOfMonth(lastMonth);
        end = endOfMonth(lastMonth);
        break;
      case "last-3-months":
        start = startOfMonth(subMonths(today, 2));
        end = today;
        break;
      case "last-6-months":
        start = startOfMonth(subMonths(today, 5));
        end = today;
        break;
      case "year-to-date":
        start = startOfYear(today);
        end = today;
        break;
      case "last-year":
        const lastYear = subMonths(today, 12);
        start = startOfYear(lastYear);
        end = endOfYear(lastYear);
        break;
      case "custom":
        // Mantém as datas atuais para seleção personalizada
        return;
      default:
        start = startOfMonth(today);
        end = today;
    }

    setStartDate(start);
    setEndDate(end);

    // Se não for personalizado, aplica os filtros automaticamente
    if (value !== "custom") {
      const params = new URLSearchParams();
      params.set("startDate", format(start, "yyyy-MM-dd"));
      params.set("endDate", format(end, "yyyy-MM-dd"));
      params.set("period", value);
      router.push(`/dashboard/relatorio?${params.toString()}`);
    }
  };

  const applyFilters = () => {
    if (!startDate || !endDate) return;

    const params = new URLSearchParams();
    params.set("startDate", format(startDate, "yyyy-MM-dd"));
    params.set("endDate", format(endDate, "yyyy-MM-dd"));
    params.set("period", period);

    router.push(`/dashboard/relatorio?${params.toString()}`);
  };

  const clearFilters = () => {
    const today = new Date();
    const firstDayCurrentMonth = startOfMonth(today);

    setStartDate(firstDayCurrentMonth);
    setEndDate(today);
    setPeriod("current-month");

    const params = new URLSearchParams();
    params.set("startDate", format(firstDayCurrentMonth, "yyyy-MM-dd"));
    params.set("endDate", format(today, "yyyy-MM-dd"));
    params.set("period", "current-month");

    router.push(`/dashboard/relatorio?${params.toString()}`);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-month">Mês atual</SelectItem>
                <SelectItem value="last-month">Mês anterior</SelectItem>
                <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
                <SelectItem value="last-6-months">Últimos 6 meses</SelectItem>
                <SelectItem value="year-to-date">Ano até hoje</SelectItem>
                <SelectItem value="last-year">Ano anterior</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !startDate && "text-muted-foreground",
                  )}
                  disabled={period !== "custom"}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {startDate
                    ? format(startDate, "PP", { locale: ptBR })
                    : "Data inicial"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  locale={ptBR}
                  disabled={period !== "custom"}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !endDate && "text-muted-foreground",
                  )}
                  disabled={period !== "custom"}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {endDate
                    ? format(endDate, "PP", { locale: ptBR })
                    : "Data final"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  locale={ptBR}
                  disabled={period !== "custom"}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" onClick={clearFilters} className="gap-2">
              <XIcon className="size-4" />
              Limpar Filtros
            </Button>
            <Button onClick={applyFilters} disabled={period !== "custom"}>
              <FilterIcon className="mr-2 size-4" />
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
