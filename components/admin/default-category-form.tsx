"use client";

import { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  type: z.enum(["INCOME", "EXPENSE"]),
  color: z.string().min(4, "Selecione uma cor"),
  icon: z.string().optional(),
});

interface DefaultCategoryFormProps {
  onSuccess?: () => void;
}

export function DefaultCategoryForm({ onSuccess }: DefaultCategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "EXPENSE",
      color: "#000000",
      icon: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error();

      toast.success("Categoria criada com sucesso!");
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao criar categoria");
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
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-10"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    {form.watch("icon") || "😀"}
                  </Button>
                  <Input placeholder="Ex: Alimentação" {...field} />
                </div>
              </FormControl>
              {showEmojiPicker && (
                <div className="absolute z-50 mt-1">
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji: any) => {
                      form.setValue("icon", emoji.native);
                      setShowEmojiPicker(false);
                    }}
                  />
                </div>
              )}
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
                    <SelectValue placeholder="Selecione o tipo" />
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
                    value={field.value || "#64f296"}
                    className="h-10 w-12 cursor-pointer p-1"
                  />
                  <Input
                    type="text"
                    value={field.value || ""}
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

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Criando..." : "Criar categoria"}
        </Button>
      </form>
    </Form>
  );
}
