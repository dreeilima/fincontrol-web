"use client";

import { Loading } from "@/components/shared/loading";

interface FormLoadingProps {
  message?: string;
  className?: string;
}

export function FormLoading({ message = "Carregando formulário...", className }: FormLoadingProps) {
  return (
    <div className={`flex w-full flex-col items-center justify-center py-10 ${className}`}>
      <Loading size="lg" />
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
