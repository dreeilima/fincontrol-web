"use client";

import { useCategories } from "@/contexts/categories-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { categories } from "@prisma/client";
import * as Icons from "lucide-react";
import { icons } from "lucide-react";
import { ChromePicker } from "react-color";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["INCOME", "EXPENSE"]),
  color: z.string().min(1, "Cor é obrigatória"),
  icon: z.string().min(1, "Ícone é obrigatório"),
});

interface CategoryFormProps {
  type: "INCOME" | "EXPENSE";
  category?: categories;
  onSuccess?: () => void;
}

export function CategoryForm({ type, category, onSuccess }: CategoryFormProps) {
  const { fetchCategories } = useCategories();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name ?? "",
      type: type,
      color: category?.color ?? "#000000",
      icon: category?.icon ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar categoria");
      }

      toast.success("Categoria criada com sucesso!");

      // Atualizar a lista de categorias
      await fetchCategories();

      // Resetar o formulário
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar categoria");
    }
  };

  const iconNames = Object.keys(icons);

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
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ícone</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um ícone">
                      {field.value && (
                        <div className="flex items-center gap-2">
                          <DynamicIcon name={field.value} size={16} />
                          <span>{field.value}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[300px]">
                  {iconNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      <div className="flex items-center gap-2">
                        <DynamicIcon name={name} size={16} />
                        <span>{name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <div className="flex h-10 w-full items-center gap-2 rounded-md border px-3">
                      <div
                        className="size-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                      <span>{field.value}</span>
                    </div>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <ChromePicker
                    color={field.value}
                    onChange={(color) => field.onChange(color.hex)}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {category ? "Salvar Alterações" : "Criar Categoria"}
        </Button>
      </form>
    </Form>
  );
}
