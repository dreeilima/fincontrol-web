"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserSubscriptionPlan } from "@/types";

import { SubscriptionPlan } from "@/types/index";
import { pricingData } from "@/config/subscriptions";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BillingFormButton } from "@/components/forms/billing-form-button";
import { ModalContext } from "@/components/modals/providers";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

interface PricingCardsProps {
  userId?: string;
  subscriptionPlan?: UserSubscriptionPlan;
}

export function PricingCards({ userId, subscriptionPlan }: PricingCardsProps) {
  const { setShowSignInModal } = useContext(ModalContext);
  const router = useRouter();
  // Removed yearly/monthly toggle - using only monthly pricing

  const PricingCard = ({ offer }: { offer: SubscriptionPlan }) => {
    return (
      <div
        className={cn(
          "relative flex flex-col overflow-hidden rounded-3xl border shadow-sm",
          offer.title.toLocaleLowerCase() === "premium"
            ? "-m-0.5 transform border-2 border-green-500 shadow-lg transition-transform duration-300 hover:scale-105"
            : "",
        )}
        key={offer.title}
      >
        {offer.title.toLowerCase() === "premium" && (
          <div className="absolute right-4 top-4 rounded-md bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-md">
            RECOMENDADO
          </div>
        )}
        <div className="min-h-[150px] items-start space-y-4 bg-muted/50 p-6">
          <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
            {offer.title}
          </p>

          <div className="flex flex-row">
            <div className="flex items-end">
              <div className="flex whitespace-nowrap text-left text-3xl font-semibold leading-6">
                {`R$ ${offer.price.monthly.toFixed(2)}`}
              </div>
              <div className="-mb-1 ml-2 text-left text-sm font-medium text-muted-foreground">
                <div>/mês</div>
              </div>
            </div>
          </div>
          {offer.price.monthly > 0 && (
            <div className="text-left text-sm text-muted-foreground">
              cobrado mensalmente
            </div>
          )}
        </div>

        <div className="flex h-full flex-col justify-between gap-16 p-6">
          <ul className="space-y-2 text-left text-sm font-medium leading-normal">
            {offer.features.map((feature) => (
              <li className="flex items-start gap-x-3" key={feature}>
                <Icons.check className="size-5 shrink-0 text-green-500" />
                <p>{feature}</p>
              </li>
            ))}

            {offer.limitations.length > 0 &&
              offer.limitations.map((feature) => (
                <li
                  className="flex items-start text-muted-foreground"
                  key={feature}
                >
                  <Icons.close className="mr-3 size-5 shrink-0" />
                  <p>{feature}</p>
                </li>
              ))}
          </ul>

          {userId && subscriptionPlan ? (
            offer.title === "básico" ? (
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    rounded: "full",
                  }),
                  "w-full",
                )}
              >
                Ir para o dashboard
              </Link>
            ) : (
              <BillingFormButton
                year={false}
                offer={offer}
                subscriptionPlan={subscriptionPlan}
              />
            )
          ) : (
            <Button
              className={cn(
                "w-full",
                offer.title.toLowerCase() === "premium"
                  ? "bg-green-500 text-lg font-bold hover:bg-green-600"
                  : "",
              )}
              rounded="full"
              onClick={() =>
                router.push(`/register?plan=${offer.title.toLowerCase()}`)
              }
            >
              Começar agora
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <MaxWidthWrapper>
      <section className="flex flex-col items-center text-center">
        <HeaderSection
          label="Preço"
          title="Escolha o plano ideal para você"
          subtitle="Planos mensais simples e transparentes para controlar suas finanças"
        />

        {/* Removed yearly/monthly toggle - using only monthly pricing */}

        <div className="mx-auto grid max-w-4xl gap-8 bg-inherit py-8 md:grid-cols-2">
          {pricingData.map((offer) => (
            <PricingCard offer={offer} key={offer.title} />
          ))}
        </div>

        <p className="mt-3 text-balance text-center text-base text-muted-foreground">
          Email{" "}
          <a
            className="font-medium text-primary hover:underline"
            href="mailto:support@fincontrol.com"
          >
            support@fincontrol.com
          </a>{" "}
          para contatar nosso time de suporte.
          <br />
        </p>
      </section>
    </MaxWidthWrapper>
  );
}
