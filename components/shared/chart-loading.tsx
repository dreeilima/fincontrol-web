"use client";

import { Loading } from "@/components/shared/loading";

interface ChartLoadingProps {
  height?: string;
  className?: string;
}

export function ChartLoading({ height = "h-64", className }: ChartLoadingProps) {
  return (
    <div className={`flex w-full flex-col items-center justify-center ${height} ${className}`}>
      <Loading size="lg" />
      <p className="mt-4 text-sm text-muted-foreground">Carregando gráfico...</p>
    </div>
  );
}
