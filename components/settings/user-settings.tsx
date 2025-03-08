"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "next-auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { DeleteAccountDialog } from "@/components/settings/delete-account-dialog";
import { UserAvatar } from "@/components/shared/user-avatar";

const profileFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
});

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
});

interface UserSettingsProps {
  user: User;
}

export function UserSettings({ user }: UserSettingsProps) {
  const router = useRouter();
  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const notificationsForm = useForm({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: user.emailNotifications ?? true,
      marketingEmails: user.marketingEmails ?? false,
    },
  });

  async function onProfileSubmit(data: z.infer<typeof profileFormSchema>) {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Falha ao atualizar perfil");

      toast.success("Perfil atualizado com sucesso!");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    }
  }

  async function onNotificationsSubmit(
    data: z.infer<typeof notificationsFormSchema>,
  ) {
    try {
      const response = await fetch("/api/user/notifications", {
        method: "PATCH",
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Falha ao atualizar notificações");

      toast.success("Preferências de notificação atualizadas!");
    } catch (error) {
      toast.error("Erro ao atualizar notificações");
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Seu Perfil</CardTitle>
            <CardDescription>
              Gerencie suas informações pessoais e como elas são exibidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <UserAvatar
                user={{ name: user.name || null, image: user.image || null }}
                className="size-16"
              />
              <div>
                <h3 className="text-lg font-medium">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Separator className="my-6" />
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Salvar Alterações</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Excluir Conta</CardTitle>
            <CardDescription>
              Exclua permanentemente sua conta e todos os dados associados
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <DeleteAccountDialog />
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>
              Configure como você deseja receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...notificationsForm}>
              <form
                onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={notificationsForm.control}
                  name="emailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Notificações por Email</FormLabel>
                        <FormDescription>
                          Receba atualizações sobre suas finanças por email
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
                <FormField
                  control={notificationsForm.control}
                  name="marketingEmails"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Emails de Marketing</FormLabel>
                        <FormDescription>
                          Receba novidades e promoções do FinControl
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
                <Button type="submit">Salvar Preferências</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
