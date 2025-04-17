"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { useSystemSettings } from "@/hooks/use-system-settings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function LimitsCard() {
  const { settings, isLoading, hasLimits } = useSystemSettings();
  const [counts, setCounts] = useState({
    categories: 0,
    transactions: 0,
  });

  // Buscar contagem de categorias e transações
  useEffect(() => {
    // Função para buscar as contagens
    async function fetchCounts() {
      try {
        // Buscar contagem de categorias
        const categoriesResponse = await fetch("/api/categories");
        if (categoriesResponse.ok) {
          const categories = await categoriesResponse.json();
          setCounts((prev) => ({ ...prev, categories: categories.length }));
        }

        // Buscar contagem de transações do mês atual
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Formatar datas para a URL
        const startStr = startOfMonth.toISOString();
        const endStr = endOfMonth.toISOString();

        // Buscar transações do mês atual
        const transactionsResponse = await fetch(
          `/api/transactions/count?startDate=${startStr}&endDate=${endStr}`,
        );

        if (transactionsResponse.ok) {
          const data = await transactionsResponse.json();
          console.log("Contagem de transações recebida:", data);
          setCounts((prev) => ({ ...prev, transactions: data.count }));
        }
      } catch (error) {
        console.error("Erro ao buscar contagens:", error);
      }
    }

    // Buscar dados inicialmente
    fetchCounts();

    // Configurar intervalo para atualizar a cada 30 segundos
    const intervalId = setInterval(fetchCounts, 30000);

    // Limpar intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);

  // Se não há limites ou está carregando, não exibir o card
  if (isLoading || !hasLimits) {
    return null;
  }

  const categoriesPercentage = settings?.max_categories
    ? Math.min(
        100,
        Math.round((counts.categories / settings.max_categories) * 100),
      )
    : 0;

  const transactionsPercentage = settings?.max_transactions
    ? Math.min(
        100,
        Math.round((counts.transactions / settings.max_transactions) * 100),
      )
    : 0;

  const isNearCategoryLimit = categoriesPercentage >= 80;
  const isNearTransactionLimit = transactionsPercentage >= 80;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          Limites do Plano Básico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {settings?.max_categories && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Categorias</span>
              <span
                className={
                  isNearCategoryLimit ? "font-medium text-amber-500" : ""
                }
              >
                {counts.categories} / {settings.max_categories}
              </span>
            </div>
            <Progress
              value={categoriesPercentage}
              className={isNearCategoryLimit ? "bg-amber-100" : ""}
            />
          </div>
        )}

        {settings?.max_transactions && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Transações (este mês)</span>
              <span
                className={
                  isNearTransactionLimit ? "font-medium text-amber-500" : ""
                }
              >
                {counts.transactions !== undefined ? counts.transactions : "0"}{" "}
                / {settings.max_transactions}
              </span>
            </div>
            <Progress
              value={transactionsPercentage}
              className={isNearTransactionLimit ? "bg-amber-100" : ""}
            />
          </div>
        )}

        {(isNearCategoryLimit || isNearTransactionLimit) && (
          <Alert variant="warning" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              Você está se aproximando do limite do seu plano. Considere
              atualizar para o plano Premium para recursos ilimitados.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
