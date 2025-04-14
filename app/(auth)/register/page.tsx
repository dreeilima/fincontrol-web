"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import fincontrolTrans from "@/public/_static/fincontrol-trans.png";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/forms/user-auth-form";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan");

  return (
    <div className="container relative h-screen w-screen flex-col items-center justify-center lg:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8",
        )}
      >
        Login
      </Link>

      {/* Lado esquerdo - Banner */}
      <div className="hidden h-full bg-gradient-to-b from-green-500 to-green-600 lg:block">
        <div className="relative flex h-full flex-col items-center justify-center px-12">
          <div className="bg-pattern absolute inset-0 opacity-5" />

          <div className="relative text-center">
            <Image
              src={fincontrolTrans}
              alt="Fincontrol"
              className="mx-auto size-40 drop-shadow-xl"
              priority
            />
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-white">
                Fincontrol
              </h1>
              <p className="text-xl font-medium text-white/90">
                💡 Suas finanças no controle, seu futuro nas suas mãos.
              </p>
              <p className="text-lg text-white/80">
                Gerencie suas finanças de forma simples e eficiente.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Crie sua conta
            </h2>
          </div>

          <UserAuthForm type="register" />

          {selectedPlan && (
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-sm font-medium">
                Plano selecionado:{" "}
                <span className="font-semibold text-primary">
                  {selectedPlan.toUpperCase()}
                </span>
              </p>
            </div>
          )}

          <p className="px-8 text-center text-sm text-muted-foreground">
            Ao clicar em continuar, você concorda com nossos{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Termos de Serviço
            </Link>{" "}
            e{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
