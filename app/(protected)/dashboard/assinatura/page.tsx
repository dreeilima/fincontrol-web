"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/shared/icons";

interface Subscription {
  id: string;
  status: string;
  price_amount: number;
  stripe_current_period_end: string;
  current_plan: string; // Added this property
  next_plans?: {
    id: string;
    name: string;
    price_amount: number;
    features: string[];
  }[];
}

// Remove duplicate subscription state
export default function BillingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);

  // Remove duplicate useEffect for loadSubscription
  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const response = await fetch("/api/subscription");
        const data = await response.json();
        console.log("Subscription data:", data); // Debug log

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          if (response.status === 404) {
            router.push("/pricing");
            return;
          }
          throw new Error(
            data.error || "Falha ao carregar dados da assinatura",
          );
        }

        setSubscription(data);
      } catch (error) {
        toast.error("Erro ao carregar dados da assinatura");
        router.push("/pricing");
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscription();
  }, [router]);

  // Move loadInvoices to a separate useEffect
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const response = await fetch("/api/subscription/invoices");
        if (response.ok) {
          const data = await response.json();
          setInvoices(data);
        }
      } catch (error) {
        console.error("Erro ao carregar faturas:", error);
      }
    };

    if (subscription?.status === "active") {
      loadInvoices();
    }
  }, [subscription?.status]); // Change dependency to subscription.status

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const response = await fetch("/api/subscription");
        const data = await response.json();
        console.log("Subscription data:", data); // Debug log

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          if (response.status === 404) {
            router.push("/pricing");
            return;
          }
          throw new Error(
            data.error || "Falha ao carregar dados da assinatura",
          );
        }

        setSubscription(data);
      } catch (error) {
        toast.error("Erro ao carregar dados da assinatura");
        router.push("/pricing");
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscription();
  }, [router]);

  const handleUpgrade = async (priceId: string) => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (error) {
      toast.error("Erro ao processar atualização");
    }
  };

  const handleCancel = async () => {
    if (!confirm("Tem certeza que deseja cancelar sua assinatura?")) return;

    try {
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Assinatura cancelada com sucesso");
        router.refresh();
      } else {
        throw new Error("Falha ao cancelar assinatura");
      }
    } catch (error) {
      toast.error("Erro ao cancelar assinatura");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="animate-spin">
          <Icons.spinner className="size-8" />
        </div>
        <p className="text-muted-foreground">Carregando informações...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Assinatura</h1>
        <p className="text-muted-foreground">
          Gerencie sua assinatura e informações de pagamento
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status da Assinatura</CardTitle>
            <CardDescription>
              Informações sobre sua assinatura atual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Plano Atual</span>
              <div className="flex items-center gap-2">
                <span className="font-medium capitalize">
                  {subscription?.current_plan || "Básico"}
                </span>
                <Badge
                  variant={
                    subscription?.status === "active"
                      ? "default"
                      : "destructive"
                  }
                >
                  {subscription?.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Próxima Cobrança</span>
              <span className="font-medium">
                {new Date(
                  subscription?.stripe_current_period_end as string,
                ).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Valor</span>
              <span className="font-medium">
                {formatCurrency((subscription?.price_amount || 0) / 100)}/mês
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            {subscription?.next_plans && subscription.next_plans.length > 0 ? (
              <Button
                onClick={() =>
                  subscription?.next_plans?.[0]?.id &&
                  handleUpgrade(subscription.next_plans[0].id)
                }
                className="w-full"
                variant="default"
              >
                Fazer Upgrade para {subscription.next_plans[0].name}
              </Button>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Você já possui o plano mais avançado
              </p>
            )}
            <Button
              onClick={handleCancel}
              variant="destructive"
              className="w-full"
            >
              Cancelar Assinatura
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pagamentos</CardTitle>
            <CardDescription>
              Suas faturas e pagamentos recentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invoices.length > 0 ? (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div>
                      <p className="font-medium">
                        Fatura{" "}
                        {new Date(invoice.created * 1000).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Status:{" "}
                        {invoice.status === "paid" ? "Pago" : "Pendente"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="mr-2 font-medium">
                        {formatCurrency(invoice.amount_paid / 100)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          window.open(invoice.hosted_invoice_url, "_blank")
                        }
                      >
                        Ver Fatura
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">
                Nenhuma fatura encontrada
              </p>
            )}
          </CardContent>
        </Card>

        {/* Card dos próximos planos */}
        {subscription?.next_plans && subscription.next_plans.length > 0 ? (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Planos Disponíveis para Upgrade</CardTitle>
              <CardDescription>
                Compare os planos e escolha o melhor para você
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {subscription.next_plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="space-y-4 rounded-lg border p-6 transition-colors hover:border-primary"
                  >
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <p className="text-2xl font-bold">
                        {formatCurrency(plan.price_amount / 100)}/mês
                      </p>
                    </div>
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <Icons.check className="mr-2 size-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => handleUpgrade(plan.id!)}
                      className="w-full"
                      variant="default"
                    >
                      Fazer Upgrade para {plan.name}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
