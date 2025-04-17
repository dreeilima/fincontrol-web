"use client";

import { Loading } from "@/components/shared/loading";

interface ModalLoadingProps {
  message?: string;
  className?: string;
}

export function ModalLoading({ message = "Processando...", className }: ModalLoadingProps) {
  return (
    <div className={`flex w-full flex-col items-center justify-center py-8 ${className}`}>
      <Loading size="md" />
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
