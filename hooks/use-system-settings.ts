"use client";

import { useQuery } from "@tanstack/react-query";

interface SystemSettings {
  max_categories: number | null;
  max_transactions: number | null;
  default_currency: string;
  date_format: string;
  decimal_separator: string;
  thousands_separator: string;
}

export function useSystemSettings() {
  const { data, isLoading, error } = useQuery<SystemSettings>({
    queryKey: ["system-settings"],
    queryFn: async () => {
      const response = await fetch("/api/system-settings");
      if (!response.ok) {
        throw new Error("Erro ao carregar configurações do sistema");
      }
      return response.json();
    },
  });

  return {
    settings: data,
    isLoading,
    error,
    // Valores padrão caso os dados ainda não tenham sido carregados
    maxCategories: data?.max_categories ?? null,
    maxTransactions: data?.max_transactions ?? null,
    defaultCurrency: data?.default_currency ?? "BRL",
    dateFormat: data?.date_format ?? "DD/MM/YYYY",
    decimalSeparator: data?.decimal_separator ?? ",",
    thousandsSeparator: data?.thousands_separator ?? ".",
    // Funções auxiliares
    hasLimits: data?.max_categories !== null || data?.max_transactions !== null,
    formatCurrency: (value: number) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: data?.default_currency ?? "BRL",
      }).format(value);
    },
  };
}
