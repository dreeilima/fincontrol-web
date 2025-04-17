"use client";

import { useEffect, useState } from "react";
import { useTransactions } from "@/contexts/transactions-context";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
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
import { PremiumUpgradeDialog } from "@/components/upgrade/premium-upgrade-dialog";

const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  type: z.enum(["INCOME", "EXPENSE"], {
    required_error: "O tipo de categoria é obrigatório.",
  }),
  color: z
    .string()
    .min(4, {
      message: "A cor é obrigatória.",
    })
    .nullable(),
  icon: z.string().optional(),
});

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
    type: "INCOME" | "EXPENSE";
    color: string | null;
    icon?: string | null;
  };
  onSuccess?: () => void;
  isSheet?: boolean;
}

export function CategoryForm({
  category,
  onSuccess,
  isSheet,
}: CategoryFormProps) {
  const { createCategory, updateCategory } = useTransactions();
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const isEditing = !!category;

  // Estado para controlar o diálogo de upgrade
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [systemSettings, setSystemSettings] = useState<{
    max_categories: number | null;
  }>({ max_categories: null });

  // Buscar configurações do sistema
  useEffect(() => {
    fetch("/api/system-settings")
      .then((res) => res.json())
      .then((data) => setSystemSettings(data))
      .catch((err) => console.error("Erro ao buscar configurações:", err));
  }, []);

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: category
      ? {
          name: category.name,
          type: category.type,
          color: category.color,
          icon: category.icon || "",
        }
      : {
          name: "",
          type: "EXPENSE",
          color: "#6366f1",
          icon: "",
        },
  });

  async function onSubmit(data: z.infer<typeof categoryFormSchema>) {
    setIsLoading(true);
    try {
      if (isEditing && category) {
        await updateCategory(category.id, data as any);
      } else {
        try {
          await createCategory(data as any);
        } catch (error) {
          // Verificar se o erro é devido ao limite de categorias
          if (error instanceof Error && error.message.includes("Limite de")) {
            // Mostrar diálogo de upgrade
            setShowUpgradeDialog(true);
            return;
          }
          throw error; // Re-lançar o erro para ser tratado no catch externo
        }
      }

      toast({
        title: isEditing ? "Categoria atualizada" : "Categoria criada",
        description: isEditing
          ? "A categoria foi atualizada com sucesso."
          : "A categoria foi criada com sucesso.",
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a categoria.",
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

        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem className="flex-1">
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
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? "Salvando..."
            : isSheet
              ? "Salvar Categoria"
              : "Criar Categoria"}
        </Button>
      </form>

      {/* Diálogo de upgrade para o plano premium */}
      {showUpgradeDialog && (
        <PremiumUpgradeDialog
          isOpen={showUpgradeDialog}
          onClose={() => setShowUpgradeDialog(false)}
          limitType="categories"
          currentLimit={systemSettings.max_categories || 10}
        />
      )}
    </Form>
  );
}
