"use client";

import { useState } from "react";
import { endOfMonth, format, startOfMonth, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateNavigationProps {
  onDateChange: (start: Date, end: Date) => void;
}

export function DateNavigation({ onDateChange }: DateNavigationProps) {
  const [date, setDate] = useState(new Date());

  const handleQuickFilter = (days: number) => {
    const end = new Date();
    const start = subDays(end, days);
    onDateChange(start, end);
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    const newDate = new Date(date);
    if (direction === "prev") {
      newDate.setMonth(date.getMonth() - 1);
    } else {
      newDate.setMonth(date.getMonth() + 1);
    }
    setDate(newDate);
    onDateChange(startOfMonth(newDate), endOfMonth(newDate));
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-background p-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleMonthChange("prev")}
      >
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
            onDateChange(startOfMonth(date), endOfMonth(date));
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
                onDateChange(startOfMonth(newDate), endOfMonth(newDate));
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="icon"
        onClick={() => handleMonthChange("next")}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
