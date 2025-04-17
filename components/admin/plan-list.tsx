"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PlanDialog } from "./plan-dialog";

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

interface PlanListProps {
  plans: Plan[];
  onUpdate: () => void;
}

export function PlanList({ plans, onUpdate }: PlanListProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleToggleStatus = async (plan: Plan) => {
    try {
      const response = await fetch(`/api/admin/plans/${plan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...plan,
          isActive: !plan.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar status do plano");
      }

      onUpdate();
    } catch (error) {
      console.error("Erro ao atualizar status do plano:", error);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm("Tem certeza que deseja excluir este plano?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/plans/${planId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Falha ao excluir plano");
      }

      onUpdate();
    } catch (error) {
      console.error("Erro ao excluir plano:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setSelectedPlan(undefined);
            setIsDialogOpen(true);
          }}
        >
          Novo Plano
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.name}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(plan.price)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {plan.period === "MONTHLY" ? "Mensal" : "Anual"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={plan.isActive}
                    onCheckedChange={() => handleToggleStatus(plan)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedPlan(plan);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(plan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PlanDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={onUpdate}
        plan={selectedPlan}
      />
    </div>
  );
}
