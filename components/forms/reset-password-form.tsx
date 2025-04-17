"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

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

const resetSchema = z.object({
  email: z.string().email("Digite um email válido"),
});

export function ResetPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resetSchema>) {
    setIsLoading(true);

    try {
      // Aqui você implementará a lógica de reset de senha
      // Por exemplo, enviar email com link de recuperação
      await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      toast.success(
        "Se existe uma conta com este email, você receberá as instruções de recuperação.",
      );

      // Redireciona para login após alguns segundos
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      toast.error(
        "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
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

        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600"
          isLoading={isLoading}
          loadingText="Enviando..."
        >
          Enviar instruções
        </Button>
      </form>
    </Form>
  );
}
