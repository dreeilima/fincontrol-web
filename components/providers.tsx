"use client";

import { CategoriesProvider } from "@/contexts/categories-context";
import { DateRangeProvider } from "@/contexts/date-range-context";
import { TransactionsProvider } from "@/contexts/transactions-context";
import { ptBR } from "date-fns/locale";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { DayPickerProvider } from "react-day-picker";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <DayPickerProvider
          initialProps={{
            locale: ptBR,
            mode: "single",
            fromYear: 2020,
            toYear: 2030,
          }}
        >
          <DateRangeProvider>
            <TransactionsProvider>
              <CategoriesProvider>{children}</CategoriesProvider>
            </TransactionsProvider>
          </DateRangeProvider>
        </DayPickerProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
