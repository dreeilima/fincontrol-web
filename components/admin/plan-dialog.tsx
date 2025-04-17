"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { PlanForm } from "./plan-form";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: "MONTHLY" | "YEARLY";
  isActive: boolean;
  features: string[];
  benefits: string[];
  limitations: string[];
}

interface PlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  plan?: Plan;
}

export function PlanDialog({
  open,
  onOpenChange,
  onSuccess,
  plan,
}: PlanDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const url = plan ? `/api/admin/plans/${plan.id}` : "/api/admin/plans";
      const method = plan ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          features: data.features.split("\n").map((f: string) => f.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao salvar plano");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar plano:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{plan ? "Editar Plano" : "Novo Plano"}</DialogTitle>
        </DialogHeader>
        <PlanForm
          initialData={plan as any}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
