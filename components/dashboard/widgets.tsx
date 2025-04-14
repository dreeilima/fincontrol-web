"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { QuickActions } from "./quick-actions";
import { RecentTransactions } from "./recent-transactions";
import { SpendingChart } from "./spending-chart";

const WIDGETS = {
  spending_chart: {
    title: "Gastos por Categoria",
    component: SpendingChart,
  },
  quick_actions: {
    title: "Ações Rápidas",
    component: QuickActions,
  },
  recent_transactions: {
    title: "Transações Recentes",
    component: RecentTransactions,
  },
} as const;

type WidgetKey = keyof typeof WIDGETS;

interface UserWidgets {
  layout: WidgetKey[];
}

export function DashboardWidgets() {
  const [widgets, setWidgets] = useState<UserWidgets | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWidgets() {
      try {
        setIsLoading(true);
        setError(null);

        // TODO: No futuro, buscar widgets do usuário da API
        // Por enquanto, usando layout padrão
        setWidgets({
          layout: ["spending_chart", "quick_actions", "recent_transactions"],
        });
      } catch (err) {
        console.error("Erro ao carregar widgets:", err);
        setError("Não foi possível carregar os widgets do dashboard");
      } finally {
        setIsLoading(false);
      }
    }

    loadWidgets();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <Card
              key={index}
              className={cn(
                "md:col-span-2 lg:col-span-1",
                index === 2 && "lg:col-span-2",
              )}
            >
              <CardHeader>
                <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-[200px] animate-pulse rounded-md bg-muted" />
              </CardContent>
            </Card>
          ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">{error}</div>
      </Card>
    );
  }

  if (!widgets) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {widgets.layout.map((widgetKey) => {
        const widget = WIDGETS[widgetKey];
        const WidgetComponent = widget.component;

        return (
          <Card
            key={widgetKey}
            className={cn(
              "md:col-span-2 lg:col-span-1",
              widgetKey === "recent_transactions" && "lg:col-span-2",
            )}
          >
            <CardHeader>
              <CardTitle>{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <WidgetComponent />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
