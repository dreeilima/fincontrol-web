"use client";

import { Loading } from "@/components/shared/loading";

interface TableLoadingProps {
  columns: number;
  rows?: number;
  className?: string;
}

export function TableLoading({ columns, rows = 5, className }: TableLoadingProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-center py-10">
        <Loading size="lg" />
      </div>
      <div className="text-center text-sm text-muted-foreground">
        Carregando dados...
      </div>
    </div>
  );
}
