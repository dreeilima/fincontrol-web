"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  default_currency: z.string().min(1, "Moeda é obrigatória"),
  date_format: z.string().min(1, "Formato de data é obrigatório"),
  time_format: z.string().min(1, "Formato de hora é obrigatório"),
  decimal_separator: z.string().min(1, "Separador decimal é obrigatório"),
  thousands_separator: z.string().min(1, "Separador de milhares é obrigatório"),
  max_categories: z.number().min(1, "Mínimo de 1 categoria"),
  max_transactions: z.number().min(1, "Mínimo de 1 transação"),
  max_file_size: z.number().min(1, "Tamanho mínimo de 1MB"),
  max_users: z.number().min(1, "Mínimo de 1 usuário"),
  max_plans: z.number().min(1, "Mínimo de 1 plano"),
  max_features_per_plan: z.number().min(1, "Mínimo de 1 recurso por plano"),
  support_email: z.string().email("Email inválido"),
  notification_email: z.string().email("Email inválido"),
  smtp_host: z.string().optional(),
  smtp_port: z.number().optional(),
  smtp_user: z.string().optional(),
  smtp_password: z.string().optional(),
  smtp_secure: z.boolean(),
  token_expiration: z.number().min(300, "Mínimo de 5 minutos"),
  max_login_attempts: z.number().min(1, "Mínimo de 1 tentativa"),
  lockout_time: z.number().min(60, "Mínimo de 1 minuto"),
  enable_email_notifications: z.boolean(),
  enable_push_notifications: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export function SystemSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      const response = await fetch("/api/admin/system-settings");
      if (!response.ok) throw new Error("Erro ao carregar configurações");
      return response.json();
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      default_currency: "BRL",
      date_format: "DD/MM/YYYY",
      time_format: "HH:mm",
      decimal_separator: ",",
      thousands_separator: ".",
      max_categories: 10,
      max_transactions: 100,
      max_file_size: 5,
      max_users: 100,
      max_plans: 5,
      max_features_per_plan: 10,
    },
    values: settings,
  });

  const { mutate: updateSettings, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await fetch("/api/admin/system-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Erro ao atualizar configurações");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
      toast.success("Configurações atualizadas com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Sistema</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => updateSettings(values))}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="default_currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moeda Padrão</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a moeda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BRL">Real (R$)</SelectItem>
                        <SelectItem value="USD">Dólar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Formato de Data</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o formato" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time_format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Formato de Hora</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o formato" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="HH:mm">24 horas</SelectItem>
                        <SelectItem value="hh:mm A">12 horas</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="decimal_separator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Separador Decimal</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o separador" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value=",">Vírgula (,)</SelectItem>
                        <SelectItem value=".">Ponto (.)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thousands_separator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Separador de Milhares</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o separador" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value=".">Ponto (.)</SelectItem>
                        <SelectItem value=",">Vírgula (,)</SelectItem>
                        <SelectItem value=" ">Espaço ( )</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Máximo de Categorias</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Número máximo de categorias que um usuário pode criar
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_transactions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Máximo de Transações</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Número máximo de transações por mês no plano gratuito
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_file_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tamanho Máximo de Arquivo (MB)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Tamanho máximo em MB para upload de arquivos
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_users"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Máximo de Usuários</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Número máximo de usuários no sistema
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_plans"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Máximo de Planos</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Número máximo de planos disponíveis
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_features_per_plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Máximo de Recursos por Plano</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Número máximo de recursos que um plano pode ter
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
