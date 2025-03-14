import { Suspense } from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import fincontrolTrans from "@/public/_static/fincontrol-trans.png";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/forms/user-auth-form";
import { Icons } from "@/components/shared/icons";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "absolute left-4 top-4 md:left-8 md:top-8",
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 size-4" />
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Image
            src={fincontrolTrans}
            alt="Fincontrol"
            className="mx-auto size-6"
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            Bem vindo de volta ao Fincontrol
          </h1>
          <p className="text-sm text-muted-foreground">
            Entre para acessar sua conta
          </p>
        </div>
        <Suspense>
          <UserAuthForm type="login" />
        </Suspense>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            Não tem uma conta? Cadastre-se agora!
          </Link>
        </p>
      </div>
    </div>
  );
}
