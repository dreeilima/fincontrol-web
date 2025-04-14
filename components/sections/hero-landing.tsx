import Link from "next/link";
import { ArrowRight, MessagesSquare } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function HeroLanding() {
  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20">
      <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
        <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
          Controle financeiro{" "}
          <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text font-extrabold text-transparent">
            direto no WhatsApp
          </span>
        </h1>

        <p className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Gerencie suas finanças de forma simples e rápida através do WhatsApp.
          Registre gastos, receba relatórios e mantenha seu controle financeiro
          em dia.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Link
            href="/pricing"
            className={cn(
              buttonVariants({ size: "lg", rounded: "full" }),
              "bg-green-500 hover:bg-green-600",
              "gap-2 px-8",
            )}
          >
            <span>Começar agora</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="#como-funciona"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
                rounded: "full",
              }),
              "gap-2 px-8",
            )}
          >
            <MessagesSquare className="size-4" />
            <span>Ver demonstração</span>
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-green-500" />
            <span>Fácil de usar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-red-500" />
            <span>100% seguro</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-purple-600" />
            <span>Suporte 24/7</span>
          </div>
        </div>
      </div>
    </section>
  );
}
