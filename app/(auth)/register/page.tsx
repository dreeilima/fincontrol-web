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
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8",
        )}
      >
        Login
      </Link>
      <div className="hidden h-full bg-green-500 lg:block" />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Image
              src={fincontrolTrans}
              alt="Fincontrol"
              className="mx-auto size-6"
            />
            <h1 className="text-2xl font-semibold tracking-tight">
              Crie sua conta
            </h1>
          </div>
          <UserAuthForm type="register" />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Ao clicar em continuar, você concorda com nossos{" "}
            <Link
              href="/terms"
              className="hover:text-brand underline underline-offset-4"
            >
              Termos de Serviço
            </Link>{" "}
            e{" "}
            <Link
              href="/privacy"
              className="hover:text-brand underline underline-offset-4"
            >
              Política de Privacidade
            </Link>
            .
          </p>
          {selectedPlan && (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Plano selecionado: {selectedPlan.toUpperCase()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
