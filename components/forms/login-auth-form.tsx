"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { loginSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/shared/icons";

export function LoginAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [isLoading, setIsLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState("");

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    setLoginError("");

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl,
      });

      if (!result?.ok || result?.error) {
        setLoginError(result?.error || "Erro ao fazer login");
        throw new Error(result?.error || "Credenciais inválidas");
      }

      // Atualiza a sessão e redireciona para o callbackUrl
      router.refresh();

      // Adiciona um pequeno delay para garantir que a sessão seja atualizada antes do redirecionamento
      setTimeout(() => {
        router.push(callbackUrl);
      }, 100);

      toast.success("Login realizado com sucesso!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao fazer login";
      toast.error(errorMessage);
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {loginError && (
        <div className="rounded-md border border-red-500 bg-red-50 p-3 text-sm text-red-600">
          {loginError}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="nome@exemplo.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <div className="flex items-center justify-between">
                    <span>Senha</span>
                    <Link
                      href="/reset-password"
                      className="text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                      Esqueceu sua senha?
                    </Link>
                  </div>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600"
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            Entrar
          </Button>
        </form>
      </Form>
    </div>
  );
}
