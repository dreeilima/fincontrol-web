"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserWithoutToken } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { DeleteAccountDialog } from "./delete-account-dialog";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "O nome deve ter pelo menos 2 caracteres.",
    })
    .transform((name) => name.trim()),
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UserSettingsProps {
  user: UserWithoutToken;
}

export function UserSettings({ user }: UserSettingsProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    // Se nada mudou, não faz a requisição
    if (data.name === user.name && data.email === user.email) {
      toast.info("Nenhuma alteração foi feita.");
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao atualizar perfil");
      }

      toast.success("Perfil atualizado com sucesso!");

      // Se precisar reautenticar (email foi alterado)
      if (result.requiresReauth) {
        toast.info("Você será redirecionado para fazer login novamente.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }

      // Atualiza os dados do formulário com os novos valores
      form.reset({
        name: result.name,
        email: result.email,
      });

      // Força a atualização da página
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar perfil",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome" {...field} />
                </FormControl>
                <FormDescription>
                  Este é o nome que será exibido no seu perfil.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="seu.email@exemplo.com" {...field} />
                </FormControl>
                <FormDescription>
                  Seu endereço de email. Ao alterar, você precisará fazer login
                  novamente.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <Button
              type="submit"
              disabled={isPending || !form.formState.isDirty}
            >
              {isPending ? "Salvando..." : "Salvar alterações"}
            </Button>
            <DeleteAccountDialog />
          </div>
        </form>
      </Form>
    </div>
  );
}
