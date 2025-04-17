"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { CategoriesProvider } from "@/contexts/categories-context";
import { DateRangeProvider } from "@/contexts/date-range-context";
import { TransactionsProvider } from "@/contexts/transactions-context";
import { UserProvider } from "@/contexts/user-context";
import { UserWithoutToken } from "@/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ptBR } from "date-fns/locale";
import { SessionProvider, useSession } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { DayPickerProvider } from "react-day-picker";

interface ProvidersProps {
  children: React.ReactNode;
  initialUser?: UserWithoutToken | null;
}

// Cliente do React Query
const queryClient = new QueryClient();

// Componente interno que obtém a sessão
function UserContextWrapper({ children, initialUser }: ProvidersProps) {
  return (
    <UserProvider initialUserData={initialUser}>
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
    </UserProvider>
  );
}

export function Providers({ children, initialUser }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <UserContextWrapper initialUser={initialUser}>
            {children}
          </UserContextWrapper>
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
