"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User as NextAuthUser } from "next-auth";
import { toast } from "sonner";

import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/shared/icons";

interface Subscription {
  id: string;
  status: string;
  price_amount: number;
  stripe_current_period_end: string;
  current_plan: string;
  next_plans?: {
    id: string;
    name: string;
    price_amount: number;
    features: string[];
  }[];
}

// Omitir a propriedade token do tipo User
type UserWithoutToken = Omit<NextAuthUser, "token"> & {
  phone: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  stripe_current_period_end: Date | null;
};

interface SubscriptionSettingsProps {
  user: UserWithoutToken;
}

export function SubscriptionSettings({ user }: SubscriptionSettingsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const response = await fetch("/api/subscription");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Falha ao carregar dados da assinatura",
          );
        }

        setSubscription(data);
      } catch (error) {
        toast.error("Erro ao carregar dados da assinatura");
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscription();
  }, []);

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
    setIsCancelling(true);

    try {
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Assinatura cancelada com sucesso");
        setShowCancelDialog(false);
        router.refresh();
      } else {
        throw new Error("Falha ao cancelar assinatura");
      }
    } catch (error) {
      toast.error("Erro ao cancelar assinatura");
    } finally {
      setIsCancelling(false);
    }
  };

  async function handleReactivate() {
    try {
      const response = await fetch("/api/subscription/reactivate", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        if (data.url) {
          // Se recebemos uma URL, é para o checkout (assinatura cancelada/inativa)
          toast.success("Redirecionando para o checkout...");
          window.location.href = data.url;
        } else {
          // Se não recebemos URL, a assinatura foi reativada diretamente (status "canceling")
          toast.success("Assinatura reativada com sucesso!");
          router.refresh();
        }
      } else {
        throw new Error("Falha ao reativar assinatura");
      }
    } catch (error) {
      toast.error("Erro ao reativar assinatura");
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Icons.spinner className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">
          Você ainda não possui uma assinatura ativa.
        </p>
        <Button onClick={() => router.push("/pricing")}>Ver Planos</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">
            Plano Atual: {subscription.current_plan}
          </h3>
          <Badge
            variant={
              subscription.status === "active"
                ? "default"
                : subscription.status === "canceling"
                  ? "outline"
                  : "destructive"
            }
          >
            {subscription.status === "active"
              ? "Ativo"
              : subscription.status === "canceling"
                ? "Cancelando"
                : "Inativo"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {formatCurrency((subscription.price_amount || 0) / 100)}/mês
        </p>
      </div>

      <Separator />

      {subscription.current_plan !== "Básico" && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Próxima Cobrança</p>
            <p className="text-sm text-muted-foreground">
              {new Date(
                subscription.stripe_current_period_end,
              ).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-right text-sm font-medium">Valor</p>
            <p className="text-sm text-muted-foreground">
              {formatCurrency((subscription.price_amount || 0) / 100)}
            </p>
          </div>
        </div>
      )}

      <Separator />

      <div className="space-y-4">
        {/* Status ativo com planos disponíveis para upgrade */}
        {subscription.status === "active" &&
          subscription.next_plans &&
          subscription.next_plans.length > 0 && (
            <Button
              onClick={() =>
                subscription.next_plans?.[0]?.id &&
                handleUpgrade(subscription.next_plans[0].id)
              }
              className="w-full"
              variant="default"
            >
              Fazer Upgrade para {subscription.next_plans[0].name}
            </Button>
          )}

        {/* Status "cancelando" - mostrar data de término e opção de reativar */}
        {subscription.status === "canceling" && (
          <div className="space-y-2 rounded-md border p-4">
            <p className="text-sm text-muted-foreground">
              Sua assinatura será cancelada em{" "}
              <span className="font-medium">
                {new Date(
                  subscription.stripe_current_period_end,
                ).toLocaleDateString()}
              </span>
            </p>
            <Button
              onClick={handleReactivate}
              variant="outline"
              className="w-full"
            >
              Reativar assinatura
            </Button>
          </div>
        )}

        {/* Status inativo ou cancelado - mostrar opção de reativar */}
        {(subscription.status === "canceled" ||
          subscription.status === "inactive") && (
          <div className="space-y-2 rounded-md border p-4">
            <p className="text-sm text-muted-foreground">
              Sua assinatura está inativa. Reative para ter acesso aos recursos
              premium.
            </p>
            <Button
              onClick={handleReactivate}
              variant="default"
              className="w-full"
            >
              Reativar assinatura
            </Button>
          </div>
        )}

        {/* Botão de cancelar - só aparece para assinaturas ativas e não básicas */}
        {subscription.current_plan !== "Básico" &&
          subscription.status === "active" && (
            <Button
              onClick={() => setShowCancelDialog(true)}
              variant="destructive"
              className="w-full"
            >
              Cancelar Assinatura
            </Button>
          )}
      </div>

      {/* Dialog de confirmação de cancelamento */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar assinatura</DialogTitle>
            <DialogDescription className="pt-2 text-muted-foreground">
              Ao cancelar sua assinatura:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Icons.check className="mt-0.5 size-4 flex-shrink-0 text-green-500" />
                  <span>
                    Você continuará com acesso ao plano Premium até{" "}
                    <strong>
                      {new Date(
                        subscription.stripe_current_period_end as string,
                      ).toLocaleDateString()}
                    </strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Icons.check className="mt-0.5 size-4 flex-shrink-0 text-green-500" />
                  <span>Não haverá mais cobranças após este período</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icons.help className="mt-0.5 size-4 flex-shrink-0 text-blue-500" />
                  <span>
                    Após esta data, sua conta será automaticamente movida para o{" "}
                    <strong>Plano Básico</strong> (gratuito)
                  </span>
                </li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              Tem certeza que deseja continuar com o cancelamento?
            </p>
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isCancelling}
            >
              {isCancelling && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              Confirmar cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mostrar recursos do plano atual */}
      <div className="mt-8 space-y-4">
        <h4 className="text-sm font-medium">Recursos do seu plano:</h4>
        {subscription.next_plans && subscription.next_plans[0]?.features && (
          <ul className="space-y-2">
            {subscription.next_plans[0].features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Icons.check className="mt-0.5 size-4 flex-shrink-0 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
