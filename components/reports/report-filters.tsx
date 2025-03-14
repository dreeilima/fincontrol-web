"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, FilterIcon } from "lucide-react";

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
  const firstDayCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1,
  );

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

    switch (value) {
      case "current-month":
        setStartDate(new Date(today.getFullYear(), today.getMonth(), 1));
        setEndDate(today);
        break;
      case "last-month":
        setStartDate(new Date(today.getFullYear(), today.getMonth() - 1, 1));
        setEndDate(new Date(today.getFullYear(), today.getMonth(), 0));
        break;
      case "last-3-months":
        setStartDate(subMonths(today, 3));
        setEndDate(today);
        break;
      case "last-6-months":
        setStartDate(subMonths(today, 6));
        setEndDate(today);
        break;
      case "year-to-date":
        setStartDate(new Date(today.getFullYear(), 0, 1));
        setEndDate(today);
        break;
      case "last-year":
        setStartDate(new Date(today.getFullYear() - 1, 0, 1));
        setEndDate(new Date(today.getFullYear() - 1, 11, 31));
        break;
      case "custom":
        // Manter as datas atuais para seleção personalizada
        break;
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (startDate) {
      params.set("startDate", format(startDate, "yyyy-MM-dd"));
    }

    if (endDate) {
      params.set("endDate", format(endDate, "yyyy-MM-dd"));
    }

    params.set("period", period);

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
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="ml-auto">
            <Button onClick={applyFilters}>
              <FilterIcon className="mr-2 size-4" />
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
