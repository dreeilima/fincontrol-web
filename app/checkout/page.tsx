import { auth } from "@/lib/auth";
import { CheckoutPageClient } from "@/components/checkout/checkout-page-client";

export default async function CheckoutPage() {
  const session = await auth();
  return <CheckoutPageClient session={session} />;
}
