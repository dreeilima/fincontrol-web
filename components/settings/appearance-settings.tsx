"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { toast } from "@/components/ui/use-toast";

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"], {
    required_error: "Por favor, selecione um tema.",
  }),
});

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

export function AppearanceSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: (theme as "light" | "dark" | "system") || "system",
    },
  });

  async function onSubmit(data: AppearanceFormValues) {
    setIsLoading(true);

    try {
      setTheme(data.theme);

      toast({
        title: "Aparência atualizada",
        description: "Suas preferências de aparência foram atualizadas.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar suas preferências.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel>Tema</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-3 gap-4"
                >
                  <FormItem className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                    <FormControl>
                      <RadioGroupItem value="light" className="sr-only" />
                    </FormControl>
                    <div className="size-8 rounded-full border bg-white"></div>
                    <FormLabel className="font-normal">Claro</FormLabel>
                  </FormItem>
                  <FormItem className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                    <FormControl>
                      <RadioGroupItem value="dark" className="sr-only" />
                    </FormControl>
                    <div className="size-8 rounded-full border bg-slate-950"></div>
                    <FormLabel className="font-normal">Escuro</FormLabel>
                  </FormItem>
                  <FormItem className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                    <FormControl>
                      <RadioGroupItem value="system" className="sr-only" />
                    </FormControl>
                    <div className="size-8 rounded-full border bg-gradient-to-r from-white to-slate-950"></div>
                    <FormLabel className="font-normal">Sistema</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Selecione o tema de sua preferência para o FinControl.
              </FormDescription>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar preferências"}
        </Button>
      </form>
    </Form>
  );
}
