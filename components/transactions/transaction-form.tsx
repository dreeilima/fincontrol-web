"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTransactions } from "@/contexts/transactions-context"; // Adicionar import
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Category, Transaction } from "@/types/transaction";
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
import { PremiumUpgradeDialog } from "@/components/upgrade/premium-upgrade-dialog";

const formSchema = z.object({
  description: z.string().min(1, "A descrição é obrigatória"),
  amount: z.string().min(1, "O valor é obrigatório"),
  date: z.date({
    required_error: "A data é obrigatória",
  }),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().min(1, "A categoria é obrigatória"),
});

type FormData = z.infer<typeof formSchema>;

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
  const { addTransaction, updateTransaction, categories } = useTransactions();
  const isEditing = !!transaction;

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

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: transaction
      ? {
          description: transaction.description,
          amount: transaction.amount,
          date: (() => {
            // Cria a data usando UTC para evitar problemas de timezone
            const [year, month, day] = transaction.date
              .split("T")[0]
              .split("-");
            const date = new Date(
              Date.UTC(
                Number(year),
                Number(month) - 1, // mês é 0-based
                Number(day),
                3, // 3 horas UTC = 00:00 Brasília
                0,
                0,
              ),
            );
            console.log("Data ajustada:", date.toISOString());
            return date;
          })(),
          type: transaction.type,
          categoryId: transaction.categoryId,
        }
      : {
          description: "",
          amount: "",
          date: new Date(),
          type: "EXPENSE",
          categoryId: "",
        },
  });

  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  useEffect(() => {
    const type = form.watch("type");
    setFilteredCategories(categories.filter((cat) => cat.type === type));
  }, [categories, form.watch("type")]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: FormData) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const formattedData = {
        description: values.description,
        amount: values.amount,
        date: values.date.toISOString(),
        type: values.type,
        categoryId: values.categoryId,
      };

      if (isEditing && transaction) {
        await updateTransaction(transaction.id, formattedData);
      } else {
        try {
          await addTransaction(formattedData as any);
        } catch (error) {
          // Verificar se o erro é devido ao limite de transações
          if (error instanceof Error && error.message.includes("Limite de")) {
            // Mostrar diálogo de upgrade
            setShowUpgradeDialog(true);
            setIsSubmitting(false);
            return;
          }
          throw error; // Re-lançar o erro para ser tratado no catch externo
        }
      }

      toast({
        title: isEditing ? "Transação atualizada" : "Transação criada",
        description: isEditing
          ? "A transação foi atualizada com sucesso"
          : "A transação foi criada com sucesso",
      });

      onSuccess?.();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao salvar a transação",
      });
    } finally {
      setIsSubmitting(false);
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
          render={({ field }) => {
            return (
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
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // Reseta a categoria quando o tipo muda
                  form.setValue("categoryId", "");
                }}
                value={field.value}
              >
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
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!form.watch("type")}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredCategories.length === 0 ? (
                    <SelectItem value="no-categories" disabled>
                      Nenhuma categoria disponível
                    </SelectItem>
                  ) : (
                    filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              {isEditing ? "Atualizando..." : "Criando..."}
            </>
          ) : (
            <>{isEditing ? "Atualizar" : "Criar"} Transação</>
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
