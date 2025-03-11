import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Checkout – FinControl",
  description: "Gerencie suas finanças de forma simples e eficiente.",
});

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
