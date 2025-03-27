"use client";

import { useState } from "react";
import { useDateRange } from "@/contexts/date-range-context";
import {
  addMonths,
  endOfMonth,
  format,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DateNavigation() {
  const { dateRange, setDateRange } = useDateRange();
  const [date, setDate] = useState(new Date());

  const handleQuickFilter = (days: number) => {
    const end = new Date();
    const start = subDays(end, days);
    setDateRange({ start, end });
  };

  const handlePreviousMonth = () => {
    setDateRange({
      start: subMonths(dateRange.start, 1),
      end: endOfMonth(subMonths(dateRange.start, 1)),
    });
  };

  const handleNextMonth = () => {
    setDateRange({
      start: addMonths(dateRange.start, 1),
      end: endOfMonth(addMonths(dateRange.start, 1)),
    });
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-background p-2">
      <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
        <ChevronLeft className="size-4" />
      </Button>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickFilter(0)}
        >
          Hoje
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickFilter(7)}
        >
          7 dias
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setDateRange({ start: startOfMonth(date), end: endOfMonth(date) });
          }}
        >
          Este mês
        </Button>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Calendar className="mr-2 size-4" />
            {format(date, "MMMM yyyy", { locale: ptBR })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                setDate(newDate);
                setDateRange({
                  start: startOfMonth(newDate),
                  end: endOfMonth(newDate),
                });
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="icon" onClick={handleNextMonth}>
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
