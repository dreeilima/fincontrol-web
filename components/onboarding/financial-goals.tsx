"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const goalsSchema = z.object({
  monthly_budget: z.string().min(1),
  savings_goal: z.string().min(1),
  savings_frequency: z.enum(["monthly", "weekly"]),
});

export function FinancialGoals({ onNext }: { onNext: () => void }) {
  const form = useForm<z.infer<typeof goalsSchema>>({
    resolver: zodResolver(goalsSchema),
    defaultValues: {
      monthly_budget: "",
      savings_goal: "",
      savings_frequency: "monthly",
    },
  });

  const onSubmit = async (data: z.infer<typeof goalsSchema>) => {
    try {
      await fetch("/api/user/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthlyBudget: data.monthly_budget,
          savingsGoal: data.savings_goal,
          savingsFrequency: data.savings_frequency,
        }),
      });
      onNext();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Defina seus objetivos financeiros
        </h2>
        <p className="text-muted-foreground">
          Estabeleça metas realistas para melhor controle das suas finanças
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="monthly_budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orçamento Mensal</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="R$ 0,00" {...field} />
                </FormControl>
                <FormDescription>
                  Quanto você planeja gastar por mês
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="savings_goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta de Economia</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="R$ 0,00" {...field} />
                </FormControl>
                <FormDescription>Quanto você quer economizar</FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="savings_frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequência de Economia</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Com qual frequência você pretende economizar
                </FormDescription>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Concluir Configuração
          </Button>
        </form>
      </Form>
    </div>
  );
}
