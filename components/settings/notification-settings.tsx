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
    id: "emailNotifications",
    label: "Notificações por Email",
    description: "Receba emails sobre sua atividade financeira.",
  },
  {
    id: "marketingEmails",
    label: "Emails de Marketing",
    description: "Receba emails sobre novos recursos e ofertas.",
  },
  {
    id: "transactionAlerts",
    label: "Alertas de Transações",
    description: "Seja notificado sobre novas transações.",
  },
  {
    id: "budgetAlerts",
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
      try {
        const response = await fetch("/api/user/preferences");
        if (!response.ok) throw new Error("Falha ao carregar preferências");
        const data = await response.json();
        form.reset({
          email_notifications: data.email_notifications,
          marketing_emails: data.marketing_emails,
          transaction_alerts: data.transaction_alerts,
          budget_alerts: data.budget_alerts,
        });
      } catch (error) {
        console.error("Erro ao carregar preferências:", error);
        toast.error("Não foi possível carregar suas preferências");
      }
    };

    loadPreferences();
  }, [form]);

  async function onSubmit(data: NotificationFormValues) {
    setIsPending(true);

    try {
      const response = await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Falha ao atualizar preferências");

      toast.success("Preferências de notificação atualizadas");
    } catch (error) {
      console.error("Erro ao atualizar preferências:", error);
      toast.error("Não foi possível atualizar suas preferências");
    } finally {
      setIsPending(false);
    }
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
