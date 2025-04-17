"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import { toast } from "sonner";
import * as z from "zod";

import { STRIPE_PLANS } from "@/lib/stripe-prices";
import { registerSchema } from "@/lib/validations/auth";
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

import "react-phone-input-2/lib/style.css";

interface UserAuthFormProps {
  type: "register" | "login";
}

export function UserAuthForm({ type }: UserAuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan");

  // Não redirecionamos mais para pricing se não tiver plano selecionado
  // O usuário pode criar uma conta com o plano básico gratuito por padrão

  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    console.log("Dados enviados:", values);
    setIsLoading(true);

    try {
      // 1. Registra o usuário
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        console.log("Erro na resposta:", data);
        throw new Error(data.error || "Erro ao criar conta");
      }

      const { user } = await response.json();

      // 2. Faz login automático
      const signInResult = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error("Erro ao fazer login automático");
      }

      // 3. Se tiver um plano selecionado (diferente do básico), redireciona para o checkout
      if (
        selectedPlan &&
        selectedPlan.toLowerCase() !== "básico" &&
        selectedPlan.toLowerCase() !== "basico"
      ) {
        const checkoutResponse = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan: selectedPlan.toLowerCase(),
            interval: "monthly",
          }),
        });

        const { url } = await checkoutResponse.json();
        if (url) {
          window.location.href = url;
          return; // Importante retornar aqui para não executar o código abaixo
        } else {
          throw new Error("Erro ao criar sessão de checkout");
        }
      } else {
        // Se não tiver plano selecionado ou for o plano básico, redireciona para o dashboard
        toast.success("Conta criada com sucesso! Bem-vindo ao plano Básico.");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Erro no registro:", error);
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  }

  // Agora sempre renderizamos o formulário, mesmo sem plano selecionado

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="João Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="nome@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <PhoneInput
                      country="br"
                      value={value}
                      onChange={(phone) => {
                        const cleanNumber = phone.replace(/\D/g, "");
                        const formattedNumber = cleanNumber.startsWith("55")
                          ? cleanNumber
                          : `55${cleanNumber}`;
                        onChange(formattedNumber);
                      }}
                      containerClass="w-full"
                      inputProps={{
                        placeholder: "Digite seu telefone com DDD",
                      }}
                      inputStyle={{
                        width: "100%",
                        height: "40px",
                        fontSize: "14px",
                        borderRadius: "6px",
                        backgroundColor: "transparent",
                      }}
                      buttonStyle={{
                        backgroundColor: "transparent",
                        border: "none",
                        borderRight: "1px solid var(--border)",
                        borderRadius: "6px 0 0 6px",
                      }}
                      dropdownStyle={{
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                      }}
                      searchStyle={{
                        backgroundColor: "transparent",
                        border: "none",
                        borderBottom: "1px solid var(--border)",
                        margin: "0",
                        width: "100%",
                      }}
                      enableSearch
                      disableSearchIcon
                      searchPlaceholder="Buscar país..."
                      preferredCountries={["br"]}
                    />
                  )}
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
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600"
          isLoading={isLoading}
          loadingText="Criando conta..."
        >
          Criar conta
        </Button>
      </form>
    </Form>
  );
}
