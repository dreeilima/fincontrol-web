"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const THEMES = [
  {
    value: "light",
    label: "Claro",
    description: "Tema claro para melhor visibilidade durante o dia",
  },
  {
    value: "dark",
    label: "Escuro",
    description: "Tema escuro para reduzir o cansaço visual à noite",
  },
  {
    value: "system",
    label: "Sistema",
    description: "Sincroniza com as preferências do seu sistema",
  },
] as const;

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"], {
    required_error: "Por favor, selecione um tema.",
  }),
});

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

export function AppearanceSettings() {
  const [isPending, setIsPending] = useState(false);
  const { theme, setTheme } = useTheme();

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: (theme as "light" | "dark" | "system") || "system",
    },
  });

  async function onSubmit(data: AppearanceFormValues) {
    setIsPending(true);

    try {
      setTheme(data.theme);
      toast.success("Tema atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar tema");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tema</FormLabel>
              <FormDescription>
                Selecione o tema de sua preferência para o FinControl.
              </FormDescription>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-3 gap-4"
                >
                  {THEMES.map((theme) => (
                    <FormItem key={theme.value}>
                      <FormControl>
                        <RadioGroupItem
                          value={theme.value}
                          className="peer sr-only"
                        />
                      </FormControl>
                      <FormLabel className="flex flex-col items-center justify-between rounded-lg border p-4 hover:bg-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <div
                          className={`size-8 rounded-full border ${
                            theme.value === "light"
                              ? "bg-white"
                              : theme.value === "dark"
                                ? "bg-slate-950"
                                : "bg-gradient-to-r from-white to-slate-950"
                          }`}
                        />
                        <div className="mt-2 text-center">
                          <p className="font-medium leading-none">
                            {theme.label}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {theme.description}
                          </p>
                        </div>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar preferências"}
        </Button>
      </form>
    </Form>
  );
}
