"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDateRange } from "@/contexts/date-range-context";
import { useTransactions } from "@/contexts/transactions-context";
import { Loader2 } from "lucide-react";

import { DateNavigation } from "@/components/date-navigation";

export function DashboardDateFilter() {
  const { dateRange, setDateRange } = useDateRange();
  const { fetchTransactions, fetchSummaryTransactions, isLoading } =
    useTransactions();
  const searchParams = useSearchParams();

  // Atualiza as transações quando a data muda
  useEffect(() => {
    const filters: {
      from: string;
      to: string;
      type?: string;
      category?: string;
    } = {
      from: dateRange.start.toISOString(),
      to: dateRange.end.toISOString(),
    };

    // Adiciona filtros da URL se existirem
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    if (type && type !== "all") filters.type = type;
    if (category && category !== "all") filters.category = category;

    console.log("Atualizando transações com filtros:", filters);

    Promise.all([
      fetchTransactions(filters),
      fetchSummaryTransactions(filters),
    ]).catch((error) => {
      console.error("Erro ao atualizar transações:", error);
    });
  }, [dateRange, searchParams, fetchTransactions, fetchSummaryTransactions]);

  return (
    <div className="relative">
      <DateNavigation />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
