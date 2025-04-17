"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Esquema simplificado com apenas as configurações essenciais
const formSchema = z.object({
  // Formatação
  default_currency: z.string().min(1, "Moeda é obrigatória"),
  date_format: z.string().min(1, "Formato de data é obrigatório"),
  decimal_separator: z.string().min(1, "Separador decimal é obrigatório"),
  thousands_separator: z.string().min(1, "Separador de milhares é obrigatório"),
  time_format: z.string().default("HH:mm"),

  // Limites do plano básico
  max_categories: z.number().min(1, "Mínimo de 1 categoria"),
  max_transactions: z.number().min(1, "Mínimo de 1 transação"),
  max_file_size: z.number().default(5),
  max_users: z.number().default(100),
  max_plans: z.number().default(5),
  max_features_per_plan: z.number().default(10),

  // Campos adicionais para a interface (não são enviados para a API)
  // Estes campos são apenas para demonstração e não afetam o funcionamento do sistema
  support_email: z.string().email("Email inválido").optional(),
  notification_email: z.string().email("Email inválido").optional(),
  enable_email_notifications: z.boolean().default(true),
  enable_push_notifications: z.boolean().default(true),
  maintenance_mode: z.boolean().default(false),
  allow_signups: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

// Tipo para os dados que são enviados para a API
type SystemSettingsApiData = {
  default_currency: string;
  date_format: string;
  time_format: string;
  decimal_separator: string;
  thousands_separator: string;
  max_categories: number;
  max_transactions: number;
  max_file_size: number;
  max_users: number;
  max_plans: number;
  max_features_per_plan: number;
};

export function SystemSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/admin/system-settings");

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Resposta da API (GET):", response.status, errorData);
          throw new Error(
            `Erro ao carregar configurações: ${response.status} ${errorData}`,
          );
        }

        const data = await response.json();
        console.log("Configurações carregadas:", data);
        return data;
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        throw error;
      }
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
      support_email: "suporte@fincontrol.com",
      notification_email: "notificacoes@fincontrol.com",
      enable_email_notifications: true,
      enable_push_notifications: true,
      maintenance_mode: false,
      allow_signups: true,
    },
    values: settings,
  });

  const { mutate: updateSettings, isPending } = useMutation({
    mutationFn: async (values: SystemSettingsApiData) => {
      try {
        const response = await fetch("/api/admin/system-settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Resposta da API:", response.status, errorData);
          throw new Error(
            `Erro ao atualizar configurações: ${response.status} ${errorData}`,
          );
        }

        return response.json();
      } catch (error) {
        console.error("Erro na requisição:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
      toast.success("Configurações atualizadas com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar configurações:", error);
      toast.error(`Erro ao atualizar configurações: ${error.message}`);
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">Geral</TabsTrigger>
        <TabsTrigger value="limits">Limites</TabsTrigger>
        <TabsTrigger value="system">Sistema</TabsTrigger>
      </TabsList>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => {
            // Garantir que todos os campos obrigatórios estão presentes
            // Enviar apenas os campos que existem no modelo system_settings
            const completeData: SystemSettingsApiData = {
              default_currency: values.default_currency,
              date_format: values.date_format,
              time_format: values.time_format || "HH:mm",
              decimal_separator: values.decimal_separator,
              thousands_separator: values.thousands_separator,
              max_categories: values.max_categories,
              max_transactions: values.max_transactions,
              max_file_size: values.max_file_size || 5,
              max_users: values.max_users || 100,
              max_plans: values.max_plans || 5,
              max_features_per_plan: values.max_features_per_plan || 10,
            };

            // Os campos abaixo não são enviados para a API, mas são mantidos na interface
            // para fins de demonstração
            console.log("Campos adicionais (não enviados para a API):", {
              support_email: values.support_email,
              notification_email: values.notification_email,
              enable_email_notifications: values.enable_email_notifications,
              enable_push_notifications: values.enable_push_notifications,
              maintenance_mode: values.maintenance_mode,
              allow_signups: values.allow_signups,
            });

            console.log("Enviando dados:", completeData);
            updateSettings(completeData);
          })}
          className="space-y-8 pt-6"
        >
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                  Configure as opções básicas do sistema como moeda e formato de
                  data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                            <SelectItem value="DD/MM/YYYY">
                              DD/MM/YYYY
                            </SelectItem>
                            <SelectItem value="MM/DD/YYYY">
                              MM/DD/YYYY
                            </SelectItem>
                            <SelectItem value="YYYY-MM-DD">
                              YYYY-MM-DD
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações de Email</CardTitle>
                <CardDescription>
                  Configure os emails de suporte e notificação.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="support_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email de Suporte</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="suporte@fincontrol.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Email exibido para os usuários entrarem em contato
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notification_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email de Notificação</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="notificacoes@fincontrol.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Email usado para enviar notificações aos usuários
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="limits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Limites do Plano Básico</CardTitle>
                <CardDescription>
                  Configure os limites para usuários do plano básico (gratuito).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Número máximo de categorias que um usuário do plano
                          básico pode criar
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
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Número máximo de transações por mês no plano básico
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Configure opções gerais do sistema.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="enable_email_notifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Notificações por Email
                          </FormLabel>
                          <FormDescription>
                            Ativar envio de notificações por email para todos os
                            usuários
                          </FormDescription>
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

                  <FormField
                    control={form.control}
                    name="enable_push_notifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Notificações Push
                          </FormLabel>
                          <FormDescription>
                            Ativar envio de notificações push para todos os
                            usuários
                          </FormDescription>
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

                  <FormField
                    control={form.control}
                    name="maintenance_mode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Modo de Manutenção
                          </FormLabel>
                          <FormDescription>
                            Ativar modo de manutenção (apenas administradores
                            poderão acessar)
                          </FormDescription>
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

                  <FormField
                    control={form.control}
                    name="allow_signups"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Permitir Cadastros
                          </FormLabel>
                          <FormDescription>
                            Permitir que novos usuários se cadastrem no sistema
                          </FormDescription>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </form>
      </Form>
    </Tabs>
  );
}
