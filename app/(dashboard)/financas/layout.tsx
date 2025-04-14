import { TransactionsProvider } from "@/contexts/transactions-context";

export default function FinancasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TransactionsProvider>{children}</TransactionsProvider>;
}
