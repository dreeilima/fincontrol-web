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

  useEffect(() => {
    // TODO: Buscar widgets do usuário da API
    setWidgets({
      layout: ["spending_chart", "quick_actions", "recent_transactions"],
    });
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
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
