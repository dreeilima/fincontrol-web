"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const planSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.string().min(1, "Preço é obrigatório"),
  features: z.string().min(1, "Recursos são obrigatórios"),
  isActive: z.boolean().default(true),
});

type PlanFormValues = z.infer<typeof planSchema>;

interface PlanFormProps {
  initialData?: {
    id: string;
    name: string;
    description: string;
    price: string;
    features: string;
    isActive: boolean;
  };
  onSubmit: (data: PlanFormValues) => Promise<void>;
  onCancel: () => void;
}

export function PlanForm({ initialData, onSubmit, onCancel }: PlanFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: "",
      features: "",
      isActive: true,
    },
  });

  const handleSubmit = async (data: PlanFormValues) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
      toast.success(
        initialData
          ? "Plano atualizado com sucesso!"
          : "Plano criado com sucesso!",
      );
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar o plano");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do plano" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrição do plano"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="0,00"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    const formattedValue = (Number(value) / 100).toFixed(2);
                    field.onChange(formattedValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recursos</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Liste os recursos do plano (um por linha)"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Ativo</FormLabel>
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

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : initialData ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
