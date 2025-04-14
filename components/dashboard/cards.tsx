import { auth } from "@/auth";

import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function DashboardCards() {
  const session = await auth();

  const [totalBalance, totalIncome, totalExpenses] = await Promise.all([
    db.bank_accounts.aggregate({
      where: { user_id: session?.user?.id },
      _sum: { balance: true },
    }),
    db.transactions.aggregate({
      where: {
        user_id: session?.user?.id,
        type: "INCOME",
      },
      _sum: { amount: true },
    }),
    db.transactions.aggregate({
      where: {
        user_id: session?.user?.id,
        type: "EXPENSE",
      },
      _sum: { amount: true },
    }),
  ]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(Number(totalBalance._sum.balance || 0))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receitas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(Number(totalIncome._sum.amount || 0))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(Number(totalExpenses._sum.amount || 0))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
