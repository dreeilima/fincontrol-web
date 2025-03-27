"use client";

import { useState } from "react";
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

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  transactionAlerts: z.boolean(),
  budgetAlerts: z.boolean(),
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

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
  user: User;
}

export function NotificationSettings({ user }: NotificationSettingsProps) {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      marketingEmails: false,
      transactionAlerts: true,
      budgetAlerts: true,
    },
  });

  async function onSubmit(data: NotificationsFormValues) {
    setIsPending(true);

    try {
      const response = await fetch("/api/user/notifications", {
        method: "PATCH",
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error();

      toast.success("Preferências atualizadas com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar preferências");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          {NOTIFICATIONS.map((notification) => (
            <FormField
              key={notification.id}
              control={form.control}
              name={notification.id as keyof NotificationsFormValues}
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
          {isPending ? "Salvando..." : "Salvar preferências"}
        </Button>
      </form>
    </Form>
  );
}
