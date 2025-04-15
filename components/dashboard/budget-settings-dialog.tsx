"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Slider } from "@/components/ui/slider";

const formSchema = z.object({
  monthlyBudget: z.number().min(0, "O orçamento deve ser um valor positivo"),
  savingsGoal: z
    .number()
    .min(0, "A meta de economia deve ser positiva")
    .max(100, "A meta não pode exceder 100%"),
});

type FormValues = z.infer<typeof formSchema>;

interface BudgetSettingsDialogProps {
  initialData: {
    monthlyBudget: number;
    savingsGoal: number;
  };
  onSuccess: () => void;
}

export function BudgetSettingsDialog({
  initialData,
  onSuccess,
}: BudgetSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyBudget: initialData.monthlyBudget,
      savingsGoal: initialData.savingsGoal,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true);

      const response = await fetch("/api/user/budget-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Erro ao salvar configurações de orçamento";

        if (data.error) {
          errorMessage = data.error;
        }

        if (response.status === 404) {
          errorMessage = "Sessão expirada. Por favor, faça login novamente.";
          // Redirecionar para página de login após um breve atraso
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }

        throw new Error(errorMessage);
      }

      toast.success("Configurações de orçamento atualizadas");
      setOpen(false);
      onSuccess();
      router.refresh();
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao salvar configurações",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="mr-2 h-4 w-4" />
          Configurar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurações de Orçamento</DialogTitle>
          <DialogDescription>
            Defina seu orçamento mensal e meta de economia.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            <FormField
              control={form.control}
              name="monthlyBudget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orçamento Mensal</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={100}
                      placeholder="5000"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Quanto você planeja gastar por mês
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="savingsGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Meta de Economia: {field.value.toFixed(0)}%
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    Percentual da sua renda que você deseja economizar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
