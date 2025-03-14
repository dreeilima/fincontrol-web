"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  type: z.enum(["INCOME", "EXPENSE"], {
    required_error: "O tipo de categoria é obrigatório.",
  }),
  color: z.string().min(4, {
    message: "A cor é obrigatória.",
  }),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export function CategoryForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      type: "EXPENSE",
      color: "#6366f1", // Cor padrão (indigo)
    },
  });

  async function onSubmit(data: CategoryFormValues) {
    setIsLoading(true);

    try {
      // Aqui você implementaria a lógica para salvar a categoria
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulação

      toast({
        title: "Categoria criada",
        description: "Sua categoria foi criada com sucesso.",
      });

      form.reset({
        name: "",
        type: "EXPENSE",
        color: "#6366f1",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar a categoria.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Alimentação" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="INCOME">Receita</SelectItem>
                  <SelectItem value="EXPENSE">Despesa</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Defina se esta categoria é para receitas ou despesas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    {...field}
                    className="h-10 w-12 cursor-pointer p-1"
                  />
                  <Input
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                    className="flex-1"
                  />
                </div>
              </FormControl>
              <FormDescription>
                Escolha uma cor para identificar visualmente esta categoria.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Criar Categoria"}
        </Button>
      </form>
    </Form>
  );
}
