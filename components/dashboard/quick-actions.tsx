"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  BanknoteIcon,
  BarChart3Icon,
  CreditCardIcon,
  FileTextIcon,
  TagIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionForm } from "@/components/financas/transaction-form";

export function QuickActions() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full bg-green-500 hover:bg-green-600">
            <BanknoteIcon className="mr-2 size-4" />
            Nova Receita
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Receita</DialogTitle>
          </DialogHeader>
          <TransactionForm type="INCOME" />
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full bg-red-500 hover:bg-red-600"
          >
            <CreditCardIcon className="mr-2 size-4" />
            Nova Despesa
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Despesa</DialogTitle>
          </DialogHeader>
          <TransactionForm type="EXPENSE" />
        </DialogContent>
      </Dialog>

      <Button
        variant="secondary"
        className="w-full"
        onClick={() => router.push("/dashboard/relatorio")}
      >
        <BarChart3Icon className="mr-2 size-4" />
        Ver Relatórios
      </Button>

      <Button
        variant="secondary"
        className="w-full"
        onClick={() => router.push("/dashboard/financas?tab=categories")}
      >
        <TagIcon className="mr-2 size-4" />
        Categorias
      </Button>

      <Button
        variant="secondary"
        className="w-full"
        onClick={() => router.push("/dashboard/financas")}
      >
        <FileTextIcon className="mr-2 size-4" />
        Transações
      </Button>

      <Button
        variant="ghost"
        className="w-full"
        onClick={() => router.push("/dashboard/financas")}
      >
        <ArrowRightIcon className="mr-2 size-4" />
        Ver Tudo
      </Button>
    </div>
  );
}
