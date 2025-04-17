"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PlanForm } from "./plan-form";
import { TableSkeleton } from "./skeletons/metrics-skeleton";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string;
  benefits: string;
  limitations: string;
  is_active: boolean;
}

interface Subscription {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  plan: {
    id: string;
    name: string;
  };
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export const Plans = () => {
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const queryClient = useQueryClient();

  const { data: plans, isLoading } = useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      const response = await fetch("/api/admin/plans");
      if (!response.ok) throw new Error("Erro ao carregar planos");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Plan) => {
      const response = await fetch("/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erro ao criar plano");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plano criado com sucesso");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Plan) => {
      const response = await fetch(`/api/admin/plans/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erro ao atualizar plano");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plano atualizado com sucesso");
      setOpen(false);
      setSelectedPlan(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/plans/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao deletar plano");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plano deletado com sucesso");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (data: Plan) => {
    if (selectedPlan) {
      updateMutation.mutate({ ...data, id: selectedPlan.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este plano?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Planos</h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans?.map((plan) => (
          <div key={plan.id} className="space-y-2 rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleEdit(plan)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(plan.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Deletar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-1">
              <p className="text-2xl font-bold">R$ {plan.price.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                {plan.is_active ? "Ativo" : "Inativo"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedPlan ? "Editar Plano" : "Novo Plano"}
            </DialogTitle>
          </DialogHeader>
          <PlanForm
            onSubmit={handleSubmit as any}
            onCancel={() => {
              setOpen(false);
              setSelectedPlan(null);
            }}
            initialData={selectedPlan as any}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
