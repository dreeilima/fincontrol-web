"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/shared/icons";

// Schema para login (apenas email e senha)
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Digite um email válido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
});

// Schema para registro (inclui nome e telefone)
const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Digite um email válido"),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .regex(/^\d{11}$/, "Digite um telefone válido com DDD"), // Formato: 11999999999
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
});

interface SignInModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignInModal({ isOpen, onOpenChange }: SignInModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  // Handler para atualizar os campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler para submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Login após registro ou login direto
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Credenciais inválidas");
      }

      // Buscar informações do usuário após login
      const userResponse = await fetch("/api/auth/me");
      const userData = await userResponse.json();

      onOpenChange(false);
      toast.success("Login realizado com sucesso!");

      // Redirecionar baseado no papel do usuário
      if (userData.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }

      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 outline-none sm:max-w-[400px]">
        <div className="relative flex flex-col space-y-6 p-6">
          {/* Background decorativo - Adicionado z-index negativo */}
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-b from-green-500/5 to-transparent"
            aria-hidden="true"
          />

          <DialogHeader className="space-y-1">
            <DialogTitle className="text-2xl font-bold tracking-tight">
              Bem-vindo de volta
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Continue sua jornada financeira
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label className="text-sm font-medium" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nome@exemplo.com"
                className="h-11"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-sm font-medium" htmlFor="password">
                Senha
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••"
                className="h-11"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              className="h-11 bg-green-500 hover:bg-green-600"
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              Entrar
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">
                ou continue com
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="relative h-11 hover:bg-green-500/5"
            disabled={isLoading}
            onClick={() => signIn("google")}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 size-4" />
            )}
            <span className="text-sm font-medium">Google</span>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 bg-muted/40 p-6">
          <p className="text-sm text-muted-foreground">Novo por aqui?</p>
          <Button
            variant="link"
            className="h-auto p-0 text-sm font-medium text-green-500 hover:text-green-600"
            onClick={() => {
              onOpenChange(false);
              router.push("/pricing"); // Redireciona para página de planos
            }}
          >
            Comece agora
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useSignInModal() {
  const [showSignInModal, setShowSignInModal] = React.useState(false);

  return {
    SignInModal: () => (
      <SignInModal isOpen={showSignInModal} onOpenChange={setShowSignInModal} />
    ),
    setShowSignInModal,
  };
}
