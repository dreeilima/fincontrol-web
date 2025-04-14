"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { TransactionForm } from "@/components/transactions/transaction-form";

export default function NovaTransacaoPage() {
  const searchParams = useSearchParams();
  const isEditing = searchParams.get("edit") === "true";

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">
        {isEditing ? "Editar Transação" : "Nova Transação"}
      </h1>
      <TransactionForm />
    </div>
  );
}
