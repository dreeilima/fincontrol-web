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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const preferencesFormSchema = z.object({
  theme: z.string(),
  language: z.string(),
});

type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;

const THEMES = [
  {
    value: "light",
    label: "Claro",
  },
  {
    value: "dark",
    label: "Escuro",
  },
  {
    value: "system",
    label: "Sistema",
  },
] as const;

const LANGUAGES = [
  {
    value: "pt-BR",
    label: "Português (Brasil)",
  },
  {
    value: "en",
    label: "English",
  },
  {
    value: "es",
    label: "Español",
  },
] as const;

interface PreferencesSettingsProps {
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

export function PreferencesSettings({ user }: PreferencesSettingsProps) {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      theme: "light",
      language: "pt-BR",
    },
  });

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await fetch("/api/user/preferences");
        if (!response.ok) throw new Error("Falha ao carregar preferências");
        const data = await response.json();
        form.reset({
          theme: data.theme,
          language: data.language,
        });
      } catch (error) {
        console.error("Erro ao carregar preferências:", error);
        toast.error("Não foi possível carregar suas preferências");
      }
    };

    loadPreferences();
  }, [form]);

  async function onSubmit(data: PreferencesFormValues) {
    setIsPending(true);

    try {
      const response = await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Falha ao atualizar preferências");

      toast.success("Preferências atualizadas com sucesso");
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
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tema</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tema" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {THEMES.map((theme) => (
                    <SelectItem key={theme.value} value={theme.value}>
                      {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Escolha como você quer que o aplicativo apareça.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Idioma</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um idioma" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {LANGUAGES.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Escolha o idioma em que você quer usar o aplicativo.
              </FormDescription>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </Form>
  );
}
