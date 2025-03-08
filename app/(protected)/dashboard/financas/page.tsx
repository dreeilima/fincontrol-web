import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { FinancasActions } from "@/components/financas/actions";
import { FinancasOverview } from "@/components/financas/overview";
import { TransactionsList } from "@/components/financas/transactions-list";

export default async function FinancasPage() {
  return (
    <DashboardShell>
      <DashboardHeader />
      <div className="grid gap-8">
        <FinancasOverview /> {/* Mostra saldo, receitas, despesas */}
        <FinancasActions /> {/* Botões para adicionar receita/despesa */}
        <TransactionsList /> {/* Lista das últimas transações */}
      </div>
    </DashboardShell>
  );
}
