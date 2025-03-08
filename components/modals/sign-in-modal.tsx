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

const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Digite um email válido"),
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
  const [isRegister, setIsRegister] = React.useState(false);

  // Estados para os campos do formulário
  const [formData, setFormData] = React.useState({
    name: "",
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
      if (isRegister) {
        // Lógica de registro
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Erro ao criar conta");
        }
      }

      // Login após registro ou login direto
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Credenciais inválidas");
      }

      onOpenChange(false);
      router.refresh();
      toast.success(
        isRegister
          ? "Conta criada com sucesso!"
          : "Login realizado com sucesso!",
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 outline-none">
        <div className="flex flex-col space-y-8 p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-2xl">
              {isRegister ? "Criar conta" : "Entrar"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {isRegister
                ? "Preencha os dados abaixo para criar sua conta"
                : "Entre com sua conta para continuar"}
            </p>
          </DialogHeader>

          <div className="grid gap-6">
            <Button
              variant="outline"
              className="relative"
              disabled={isLoading}
              onClick={() => signIn("google")}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 size-4" />
              )}
              Continuar com Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou continue com email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              {isRegister && (
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="exemplo@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                {isRegister ? "Criar conta" : "Entrar"}
              </Button>
            </form>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-1 bg-secondary/50 p-6">
          <p className="text-sm text-muted-foreground">
            {isRegister ? "Já tem uma conta?" : "Não tem uma conta?"}
          </p>
          <Button
            variant="link"
            className="text-sm underline"
            onClick={() => {
              setIsRegister(!isRegister);
              setFormData({
                name: "",
                email: "",
                password: "",
              });
            }}
          >
            {isRegister ? "Faça login" : "Registre-se"}
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
