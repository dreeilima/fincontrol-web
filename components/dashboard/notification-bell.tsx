"use client";

import { useEffect, useState } from "react";
import { useTransactions } from "@/contexts/transactions-context";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";

import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  read: boolean;
  type: "warning" | "info" | "success" | "danger";
}

// Estendendo interfaces necessárias para adicionar os campos que estão faltando
interface ExtendedTransaction {
  id: string;
  amount: number | string;
  date: string;
  type: "INCOME" | "EXPENSE";
  categoryId?: string;
  recurrent?: boolean;
  // Outros campos que possam existir na transação
}

interface ExtendedCategory {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  budget?: number | string;
  // Outros campos que possam existir na categoria
}

export function NotificationBell() {
  const { data: session } = useSession();
  const { transactions, categories, isLoading } = useTransactions();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && transactions.length > 0 && categories.length > 0) {
      const generatedNotifications: Notification[] = [];
      const today = new Date();

      // Verificar transações próximas do vencimento
      const upcomingBills = transactions.filter((t) => {
        const transaction = t as unknown as ExtendedTransaction;
        return (
          transaction.type === "EXPENSE" &&
          transaction.recurrent &&
          new Date(transaction.date) > today &&
          new Date(transaction.date).getTime() - today.getTime() <
            5 * 24 * 60 * 60 * 1000 // 5 dias
        );
      });

      upcomingBills.forEach((bill, index) => {
        const transaction = bill as unknown as ExtendedTransaction;
        const category = categories.find(
          (c) => c.id === transaction.categoryId,
        ) as ExtendedCategory | undefined;
        const daysLeft = Math.ceil(
          (new Date(transaction.date).getTime() - today.getTime()) /
            (24 * 60 * 60 * 1000),
        );

        generatedNotifications.push({
          id: `bill-${transaction.id}-${index}`,
          title: "Conta próxima do vencimento",
          description: `${category?.name || "Conta"} de ${formatCurrency(Number(transaction.amount))} vence em ${daysLeft} dia${daysLeft > 1 ? "s" : ""}.`,
          createdAt: new Date(),
          read: false,
          type: daysLeft <= 2 ? "danger" : "warning",
        });
      });

      // Alertas de gastos por categoria
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      // Filtrar transações do mês atual
      const currentMonthExpenses = transactions.filter((t) => {
        const transaction = t as unknown as ExtendedTransaction;
        return (
          transaction.type === "EXPENSE" &&
          new Date(transaction.date).getMonth() === currentMonth &&
          new Date(transaction.date).getFullYear() === currentYear
        );
      });

      // Agrupar por categoria
      const categoryTotals = currentMonthExpenses.reduce(
        (acc, expense) => {
          const transaction = expense as unknown as ExtendedTransaction;
          const categoryId = transaction.categoryId || "undefined";
          if (!acc[categoryId]) {
            acc[categoryId] = 0;
          }
          acc[categoryId] += Number(transaction.amount);
          return acc;
        },
        {} as Record<string, number>,
      );

      // Verificar categorias com gastos altos
      Object.entries(categoryTotals).forEach(([categoryId, amount]) => {
        const category = categories.find((c) => c.id === categoryId) as
          | ExtendedCategory
          | undefined;
        if (!category) return;

        // Se o gasto for maior que 80% do orçamento da categoria (se tiver orçamento)
        if (category.budget && amount > 0.8 * Number(category.budget)) {
          generatedNotifications.push({
            id: `budget-${categoryId}`,
            title: "Alerta de orçamento",
            description: `Você já gastou ${formatCurrency(amount)} em ${category.name} (${Math.round((amount / Number(category.budget)) * 100)}% do orçamento).`,
            createdAt: new Date(),
            read: false,
            type: amount > Number(category.budget) ? "danger" : "warning",
          });
        }
      });

      // Saldo baixo na conta (simulação - em um app real viria da API)
      const accountBalance = transactions.reduce((total, t) => {
        const transaction = t as unknown as ExtendedTransaction;
        return (
          total +
          (transaction.type === "INCOME"
            ? Number(transaction.amount)
            : -Number(transaction.amount))
        );
      }, 0);

      if (accountBalance < 500) {
        generatedNotifications.push({
          id: "low-balance",
          title: "Saldo baixo",
          description: `Seu saldo atual é de ${formatCurrency(accountBalance)}. Cuidado com os gastos!`,
          createdAt: new Date(),
          read: false,
          type: accountBalance < 200 ? "danger" : "warning",
        });
      }

      // Adicione uma notificação de dica financeira
      generatedNotifications.push({
        id: "financial-tip",
        title: "Dica financeira",
        description:
          "Lembre-se de separar 20% da sua renda para investimentos de longo prazo.",
        createdAt: new Date(),
        read: false,
        type: "info",
      });

      setNotifications(generatedNotifications);
      setHasUnread(generatedNotifications.some((n) => !n.read));
    }
  }, [isLoading, transactions, categories]);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
    setHasUnread(false);
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "danger":
        return "text-red-500";
      case "warning":
        return "text-amber-500";
      case "success":
        return "text-green-500";
      case "info":
        return "text-blue-500";
      default:
        return "text-foreground";
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setIsOpen(true)}
        >
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <h4 className="font-medium">Notificações</h4>
          {hasUnread && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto text-xs"
              onClick={markAllAsRead}
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="flex flex-col divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 ${notification.read ? "bg-background" : "bg-accent/50"}`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <h5
                      className={`font-medium ${getTypeColor(notification.type)}`}
                    >
                      {notification.title}
                    </h5>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleDateString(
                        "pt-BR",
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-4">
              <p className="text-center text-sm text-muted-foreground">
                Nenhuma notificação
              </p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
