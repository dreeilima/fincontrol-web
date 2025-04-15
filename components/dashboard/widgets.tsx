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

interface DashboardWidgetsProps {
  displayQuickActions?: boolean;
}

export function DashboardWidgets({
  displayQuickActions = true,
}: DashboardWidgetsProps) {
  const [widgets, setWidgets] = useState<UserWidgets | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWidgets() {
      try {
        setIsLoading(true);
        setError(null);

        // Filtrar ações rápidas se não devem ser exibidas
        const defaultLayout: WidgetKey[] = [
          "spending_chart",
          "recent_transactions",
        ];
        if (displayQuickActions) {
          defaultLayout.splice(1, 0, "quick_actions");
        }

        setWidgets({
          layout: defaultLayout,
        });
      } catch (err) {
        console.error("Erro ao carregar widgets:", err);
        setError("Não foi possível carregar os widgets do dashboard");
      } finally {
        setIsLoading(false);
      }
    }

    loadWidgets();
  }, [displayQuickActions]);

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <Card className="w-full">
          <CardHeader>
            <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-[250px] animate-pulse rounded-md bg-muted" />
          </CardContent>
        </Card>

        {displayQuickActions && (
          <Card className="w-full">
            <CardHeader>
              <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-[120px] animate-pulse rounded-md bg-muted" />
            </CardContent>
          </Card>
        )}

        <Card className="w-full">
          <CardHeader>
            <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-[200px] animate-pulse rounded-md bg-muted" />
          </CardContent>
        </Card>
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
    <div className="flex flex-col gap-4">
      {widgets.layout.map((widgetKey) => {
        const widget = WIDGETS[widgetKey];
        const WidgetComponent = widget.component;

        return (
          <Card key={widgetKey} className="w-full">
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
