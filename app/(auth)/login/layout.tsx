"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { Loading } from "@/components/shared/loading";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Se o usuário já estiver autenticado, redirecione para o callbackUrl
    if (status === "authenticated" && session?.user && !isRedirecting) {
      setIsRedirecting(true);
      console.log("Usuário já autenticado, redirecionando para:", callbackUrl);
      router.push(callbackUrl);
    }
  }, [session, status, router, callbackUrl, isRedirecting]);

  // Se estiver carregando ou redirecionando, mostre uma tela de carregamento simples
  if (status === "loading" || isRedirecting) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <Loading size="default" minDisplayTime={2000} />
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, mostre a página de login
  return <>{children}</>;
}
