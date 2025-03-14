"use client";

import { useDateRange } from "@/contexts/date-range-context";

import { DateNavigation } from "@/components/date-navigation";

export function DashboardDateFilter() {
  const { setDateRange } = useDateRange();

  const handleDateChange = (start: Date, end: Date) => {
    setDateRange({ start, end });
  };

  return <DateNavigation onDateChange={handleDateChange} />;
}
