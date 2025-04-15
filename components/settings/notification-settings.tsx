"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "next-auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

const notificationFormSchema = z.object({
  email_notifications: z.boolean(),
  marketing_emails: z.boolean(),
  transaction_alerts: z.boolean(),
  budget_alerts: z.boolean(),
});

type NotificationFormValues = z.infer<typeof notificationFormSchema>;

const NOTIFICATIONS = [
  {
    id: "email_notifications",
    label: "Notificações por Email",
    description: "Receba emails sobre sua atividade financeira.",
  },
  {
    id: "marketing_emails",
    label: "Emails de Marketing",
    description: "Receba emails sobre novos recursos e ofertas.",
  },
  {
    id: "transaction_alerts",
    label: "Alertas de Transações",
    description: "Seja notificado sobre novas transações.",
  },
  {
    id: "budget_alerts",
    label: "Alertas de Orçamento",
    description:
      "Seja notificado quando se aproximar dos limites de orçamento.",
  },
] as const;

interface NotificationSettingsProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: "admin" | "user";
    phone: string | null;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    stripe_price_id: string | null;
    stripe_current_period_end: Date | null;
  };
}

export function NotificationSettings({ user }: NotificationSettingsProps) {
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      email_notifications: true,
      marketing_emails: false,
      transaction_alerts: true,
      budget_alerts: true,
    },
  });

  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/user/preferences");
        if (!response.ok) throw new Error("Falha ao carregar preferências");
        const data = await response.json();

        console.log("Dados carregados da API:", data);

        form.reset({
          email_notifications: data.email_notifications,
          marketing_emails: data.marketing_emails,
          transaction_alerts: data.transaction_alerts,
          budget_alerts: data.budget_alerts,
        });
      } catch (error) {
        console.error("Erro ao carregar preferências:", error);
        toast.error("Não foi possível carregar suas preferências");
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [form]);

  async function onSubmit(data: NotificationFormValues) {
    setIsPending(true);

    try {
      console.log("Enviando dados para a API:", data);

      const response = await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Falha ao atualizar preferências");

      const responseData = await response.json();
      console.log("Resposta da API:", responseData);

      toast.success("Preferências de notificação atualizadas");

      // Recarregar as preferências após salvar
      const refreshResponse = await fetch("/api/user/preferences");
      if (refreshResponse.ok) {
        const refreshedData = await refreshResponse.json();
        console.log("Dados recarregados após salvar:", refreshedData);

        form.reset({
          email_notifications: refreshedData.email_notifications,
          marketing_emails: refreshedData.marketing_emails,
          transaction_alerts: refreshedData.transaction_alerts,
          budget_alerts: refreshedData.budget_alerts,
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar preferências:", error);
      toast.error("Não foi possível atualizar suas preferências");
    } finally {
      setIsPending(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-row items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-muted"></div>
                <div className="h-3 w-64 rounded bg-muted"></div>
              </div>
              <div className="h-6 w-10 rounded bg-muted"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-8">
          {NOTIFICATIONS.map((notification) => (
            <FormField
              key={notification.id}
              control={form.control}
              name={notification.id as keyof NotificationFormValues}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {notification.label}
                    </FormLabel>
                    <FormDescription>
                      {notification.description}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </Form>
  );
}
