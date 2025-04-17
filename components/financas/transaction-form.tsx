"use client";

import React, { useEffect, useState } from "react";
import { useTransactions } from "@/contexts/transactions-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { bank_accounts, categories, transactions } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Decimal } from "decimal.js";
import { CalendarIcon, Loader2 } from "lucide-react";
import * as Icons from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Textarea } from "@/components/ui/textarea";
import { PremiumUpgradeDialog } from "@/components/upgrade/premium-upgrade-dialog";

const formSchema = z.object({
  amount: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine((val) => !isNaN(Number(val)), {
      message: "Valor deve ser um número válido",
    })
    .transform((val) => {
      try {
        return new Decimal(val.replace(",", "."));
      } catch (error) {
        return new Decimal(0);
      }
    }),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  date: z.date(),
  type: z.enum(["INCOME", "EXPENSE"]),
});

interface TransactionFormProps {
  type: "INCOME" | "EXPENSE";
  transaction?: transactions;
  onSuccess?: () => void;
}

export function TransactionForm({
  type,
  transaction,
  onSuccess,
}: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<categories[]>([]);
  const { refreshTransactions } = useTransactions();

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) =>
        setCategories(data.filter((c: categories) => c.type === type)),
      );
  }, [type]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: transaction?.amount ? transaction.amount.toString() : "",
      description: transaction?.description ?? "",
      categoryId: transaction?.categoryId ?? "",
      date: transaction ? new Date(transaction.date) : new Date(),
      type: type,
    },
  });

  const selectedCategory = form.watch("categoryId")
    ? categories.find((c) => c.id === form.watch("categoryId"))
    : null;

  // Estado para controlar o diálogo de upgrade
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [systemSettings, setSystemSettings] = useState<{
    max_transactions: number | null;
  }>({ max_transactions: null });

  // Buscar configurações do sistema
  useEffect(() => {
    fetch("/api/system-settings")
      .then((res) => res.json())
      .then((data) => setSystemSettings(data))
      .catch((err) => console.error("Erro ao buscar configurações:", err));
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);

      // Converter o Decimal para string antes de enviar
      const dataToSend = {
        ...values,
        amount: values.amount.toString(),
        type,
      };

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        // Verificar se o erro é devido ao limite de transações
        if (
          response.status === 403 &&
          data.includes &&
          data.includes("Limite de")
        ) {
          // Mostrar diálogo de upgrade
          setShowUpgradeDialog(true);
          return;
        }
        throw new Error(data.error || data || "Algo deu errado");
      }

      toast.success(
        type === "INCOME" ? "Receita adicionada!" : "Despesa adicionada!",
      );

      await refreshTransactions();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Algo deu errado");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  {...field}
                  value={
                    field.value instanceof Decimal
                      ? field.value.toString()
                      : field.value
                  }
                  onChange={(e) => {
                    // Permitir apenas números, vírgula e ponto
                    const value = e.target.value.replace(/[^0-9.,]/g, "");
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria">
                      {selectedCategory && (
                        <div className="flex items-center gap-2">
                          {selectedCategory.icon && (
                            <span>{selectedCategory.icon}</span>
                          )}
                          <span>{selectedCategory.name}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        {category.icon && <span>{category.icon}</span>}
                        <span>{category.name}</span>
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descrição opcional" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto size-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              {type === "INCOME"
                ? "Adicionando Receita..."
                : "Adicionando Despesa..."}
            </>
          ) : type === "INCOME" ? (
            "Adicionar Receita"
          ) : (
            "Adicionar Despesa"
          )}
        </Button>
      </form>

      {/* Diálogo de upgrade para o plano premium */}
      {showUpgradeDialog && (
        <PremiumUpgradeDialog
          isOpen={showUpgradeDialog}
          onClose={() => setShowUpgradeDialog(false)}
          limitType="transactions"
          currentLimit={systemSettings.max_transactions || 10}
        />
      )}
    </Form>
  );
}
