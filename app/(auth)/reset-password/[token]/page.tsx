"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import fincontrolTrans from "@/public/_static/fincontrol-trans.png";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { NewPasswordForm } from "@/components/forms/new-password-form";

export default function ResetPasswordTokenPage() {
  const params = useParams();
  const token = params.token as string;

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
              Crie uma nova senha 🔐
            </h2>
            <p className="text-sm text-muted-foreground">
              Digite sua nova senha abaixo
            </p>
          </div>

          <NewPasswordForm token={token} />

          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Voltar para o login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
