"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps {
  date: DateRange;
  onDateChange: (date: DateRange) => void;
  className?: string;
}

export function DatePickerWithRange({
  date,
  onDateChange,
  className,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                  {format(date.to, "dd/MM/yyyy", { locale: ptBR })}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy", { locale: ptBR })
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            locale={ptBR}
          />
          <div className="flex items-center justify-between border-t p-3">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  onDateChange({
                    from: today,
                    to: today,
                  });
                }}
              >
                Hoje
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const lastMonth = new Date(today);
                  lastMonth.setMonth(lastMonth.getMonth() - 1);
                  onDateChange({
                    from: lastMonth,
                    to: today,
                  });
                }}
              >
                Último mês
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                const threeMonthsAgo = new Date(today);
                threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                onDateChange({
                  from: threeMonthsAgo,
                  to: today,
                });
              }}
            >
              Últimos 3 meses
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
