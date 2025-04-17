"use client";

import { Loading } from "@/components/shared/loading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CardLoadingProps {
  title?: string;
  className?: string;
}

export function CardLoading({ title, className }: CardLoadingProps) {
  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <h3 className="text-lg font-medium">{title}</h3>
        </CardHeader>
      )}
      <CardContent className="flex flex-col items-center justify-center py-10">
        <Loading size="md" />
        <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
      </CardContent>
    </Card>
  );
}
