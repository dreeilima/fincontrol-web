import { Wallet } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InfoCard({
  title = "Saldo Total",
  amount = 0,
  percentage = 0,
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Wallet className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(amount)}</div>
        <p className="text-xs text-muted-foreground">
          {percentage > 0 ? "+" : ""}
          {percentage}% em relação ao mês anterior
        </p>
      </CardContent>
    </Card>
  );
}
