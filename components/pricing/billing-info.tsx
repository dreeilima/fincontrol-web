import * as React from "react";
import Link from "next/link";

import { UserSubscriptionPlan } from "types";
import { cn, formatDate } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CustomerPortalButton } from "@/components/forms/customer-portal-button";

interface BillingInfoProps extends React.HTMLAttributes<HTMLFormElement> {
  userSubscriptionPlan: UserSubscriptionPlan;
}

export function BillingInfo({ userSubscriptionPlan }: BillingInfoProps) {
  const {
    title,
    description,
    stripeCustomerId,
    isPaid,
    isCanceled,
    stripeCurrentPeriodEnd,
  } = userSubscriptionPlan;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plano de assinatura</CardTitle>
        <CardDescription>
          Você está atualmente no plano <strong>{title}</strong>.
        </CardDescription>
      </CardHeader>
      <CardContent>{description}</CardContent>
      <CardFooter className="flex flex-col items-center space-y-2 border-t bg-accent py-2 md:flex-row md:justify-between md:space-y-0">
        {isPaid && stripeCurrentPeriodEnd ? (
          <p className="text-sm font-medium text-muted-foreground">
            {isCanceled
              ? "Seu plano será cancelado em "
              : "Seu plano renova em "}
            {formatDate(stripeCurrentPeriodEnd)}
          </p>
        ) : null}

        {isPaid && stripeCustomerId ? (
          <CustomerPortalButton userStripeId={stripeCustomerId} />
        ) : (
          <Link href="/pricing" className={cn(buttonVariants())}>
            Escolha um plano
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
