"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PremiumUpgradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  limitType: "transactions" | "categories";
  currentLimit: number;
}

export function PremiumUpgradeDialog({
  isOpen,
  onClose,
  limitType,
  currentLimit,
}: PremiumUpgradeDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = () => {
    setIsLoading(true);
    // Redirecionar para a página de preços
    router.push("/pricing?ref=upgrade-dialog");
  };

  const limitText = limitType === "transactions" 
    ? `${currentLimit} transações por mês` 
    : `${currentLimit} categorias`;

  const benefitsList = [
    "Transações ilimitadas",
    "Categorias ilimitadas",
    "Relatórios avançados",
    "Exportação de dados",
    "Suporte prioritário",
    "Sem anúncios"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Limite atingido</DialogTitle>
          <DialogDescription className="pt-2 text-base text-muted-foreground">
            Você atingiu o limite de {limitText} do plano básico.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-2 font-medium">Plano Premium</h3>
            <ul className="space-y-2">
              {benefitsList.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-center">
              <span className="text-2xl font-bold">R$ 19,90</span>
              <span className="text-sm text-muted-foreground">/mês</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Continuar no plano básico
          </Button>
          <Button 
            onClick={handleUpgrade} 
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? "Redirecionando..." : "Fazer upgrade"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
