"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Transaction } from "@/types/transaction";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  description: z.string().min(1, "A descrição é obrigatória"),
  amount: z.string().min(1, "O valor é obrigatório"),
  date: z.string().min(1, "A data é obrigatória"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1, "A categoria é obrigatória"),
});

interface TransactionFormProps {
  onSuccess?: () => void;
  transaction?: Transaction;
}

export function TransactionForm({
  onSuccess,
  transaction,
}: TransactionFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const isEditing = !!transaction;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: transaction?.description || "",
      amount: transaction?.amount.toString() || "",
      date:
        transaction?.date.split("T")[0] ||
        new Date().toISOString().split("T")[0],
      type: transaction?.type || "EXPENSE",
      category: transaction?.category || "",
    },
  });

  useEffect(() => {
    if (isEditing && transaction) {
      form.setValue("description", transaction.description);
      form.setValue("amount", transaction.amount.toString());
      form.setValue("date", transaction.date.split("T")[0]);
      form.setValue("type", transaction.type);
      form.setValue("category", transaction.category);
    }
  }, [form, isEditing, transaction]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const endpoint =
        isEditing && transaction
          ? `/api/transactions/${transaction.id}`
          : "/api/transactions";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          amount: parseFloat(values.amount),
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar transação");
      }

      toast({
        title: isEditing ? "Transação atualizada" : "Transação criada",
        description: isEditing
          ? "A transação foi atualizada com sucesso"
          : "A transação foi criada com sucesso",
      });

      onSuccess?.();
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao salvar a transação",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Digite a descrição" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="INCOME">Receita</SelectItem>
                  <SelectItem value="EXPENSE">Despesa</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="salario">Salário</SelectItem>
                  <SelectItem value="investimentos">Investimentos</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="outros_receita">
                    Outros (Receita)
                  </SelectItem>
                  <SelectItem value="alimentacao">Alimentação</SelectItem>
                  <SelectItem value="moradia">Moradia</SelectItem>
                  <SelectItem value="transporte">Transporte</SelectItem>
                  <SelectItem value="saude">Saúde</SelectItem>
                  <SelectItem value="educacao">Educação</SelectItem>
                  <SelectItem value="lazer">Lazer</SelectItem>
                  <SelectItem value="outros_despesa">
                    Outros (Despesa)
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {isEditing ? "Atualizar" : "Criar"} Transação
        </Button>
      </form>
    </Form>
  );
}
