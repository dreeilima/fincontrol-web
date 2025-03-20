"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTransactions } from "@/contexts/transactions-context"; // Adicionar import
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Transaction } from "@/types/transaction";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  description: z.string().min(1, "A descrição é obrigatória"),
  amount: z.string().min(1, "O valor é obrigatório"),
  date: z.date({
    required_error: "A data é obrigatória",
  }),
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
  const { addTransaction, refreshTransactions } = useTransactions(); // Usar o contexto

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: transaction?.description || "",
      amount: transaction?.amount.toString() || "",
      date: transaction?.date ? new Date(transaction.date) : new Date(),
      type: transaction?.type || "EXPENSE",
      category: transaction?.category || "",
    },
  });

  useEffect(() => {
    if (isEditing && transaction) {
      form.setValue("description", transaction.description);
      form.setValue("amount", transaction.amount.toString());
      form.setValue("date", new Date(transaction.date));
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

      // Atualizar os dados globalmente
      await refreshTransactions();

      // Limpar o formulário
      form.reset({
        description: "",
        amount: "",
        date: new Date(),
        type: "EXPENSE",
        category: "",
      });

      toast({
        title: isEditing ? "Transação atualizada" : "Transação criada",
        description: isEditing
          ? "A transação foi atualizada com sucesso"
          : "A transação foi criada com sucesso",
      });
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
            <FormItem className="flex flex-col">
              <FormLabel>Data</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
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
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
