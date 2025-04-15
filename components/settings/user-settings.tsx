"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";
import { UserWithoutToken } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { DeleteAccountDialog } from "./delete-account-dialog";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "O nome deve ter pelo menos 2 caracteres.",
    })
    .transform((name) => name.trim()),
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UserSettingsProps {
  user: UserWithoutToken;
}

export function UserSettings({ user: initialUser }: UserSettingsProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isLoadingFreshData, setIsLoadingFreshData] = useState(true);
  const { data: session, update: updateSession, status } = useSession();
  const { userData, updateUserData, refreshUserData } = useUser();
  const [userFromDatabase, setUserFromDatabase] =
    useState<UserWithoutToken | null>(null);
  const [lastSaveAttempt, setLastSaveAttempt] = useState(0);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Buscar dados mais recentes do banco de dados
  useEffect(() => {
    // Referência para controlar se o componente ainda está montado
    let isMounted = true;

    const fetchLatestUserData = async () => {
      if (!isMounted) return;

      setIsLoadingFreshData(true);
      try {
        console.log("Buscando dados atualizados do usuário...");
        const response = await fetch("/api/user/check");
        if (response.ok) {
          const freshData = await response.json();

          // Não atualiza se tiver respostas throttled
          if (freshData.throttled) {
            console.log("Resposta throttled, usando dados existentes");
            setIsLoadingFreshData(false);
            return;
          }

          console.log("Dados mais recentes do banco:", freshData);

          if (isMounted) {
            setUserFromDatabase(freshData);
            sessionStorage.setItem("lastUserFetch", Date.now().toString());

            // Atualiza o contexto se os dados forem diferentes
            if (
              !userData ||
              userData.name !== freshData.name ||
              userData.email !== freshData.email
            ) {
              updateUserData(freshData);
            }
          }
        } else {
          console.error("Erro ao buscar dados do usuário");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        if (isMounted) {
          setIsLoadingFreshData(false);
        }
      }
    };

    fetchLatestUserData();

    return () => {
      isMounted = false;
    };
  }, [lastSaveAttempt]); // Depende também do lastSaveAttempt para recarregar após uma tentativa de salvamento

  // Usar os dados mais recentes, na seguinte ordem de prioridade:
  // 1. Dados do banco de dados (mais recentes)
  // 2. Dados do contexto
  // 3. Dados da sessão
  // 4. Dados iniciais recebidos via props
  const currentUser = (userFromDatabase ||
    userData ||
    session?.user ||
    initialUser) as UserWithoutToken;

  // Para debug
  console.log("Contexto no componente:", JSON.stringify(userData));
  console.log("Dados do banco:", JSON.stringify(userFromDatabase));
  console.log("Status da sessão:", status);
  console.log("Dados da sessão:", JSON.stringify(session?.user));
  console.log("Dados do user props:", JSON.stringify(initialUser));
  console.log("Dados utilizados:", JSON.stringify(currentUser));

  // Resetar o formulário quando os dados mudarem
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
    values: {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
    },
  });

  // Atualizar formulário quando os dados do usuário mudarem
  useEffect(() => {
    if (currentUser) {
      form.reset({
        name: currentUser.name || "",
        email: currentUser.email || "",
      });
    }
  }, [currentUser, form]);

  async function onSubmit(data: ProfileFormValues) {
    // Se nada mudou, não faz a requisição
    if (data.name === currentUser.name && data.email === currentUser.email) {
      toast.info("Nenhuma alteração foi feita.");
      return;
    }

    setIsPending(true);
    setLastSaveAttempt(Date.now()); // Marca o momento da tentativa de salvamento

    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Erro ao atualizar perfil");
      }

      const result = await response.json();
      console.log("Resposta da API (PUT):", JSON.stringify(result));

      // Atualiza o contexto de usuário imediatamente
      updateUserData({
        ...result,
        // Garante que também estamos usando a formatação correta
        role: result.role || (result.role === "ADMIN" ? "admin" : "user"),
      });

      // Atualiza a sessão com os novos dados do usuário
      await updateSession({
        name: result.name,
        email: result.email,
      });

      toast.success("Perfil atualizado com sucesso!");

      // Se precisar reautenticar (email foi alterado)
      if (result.requiresReauth) {
        toast.info("Você será redirecionado para fazer login novamente.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }

      // Forçar uma revalidação completa após o sucesso
      try {
        const revalidateResponse = await fetch("/api/revalidate-session", {
          method: "POST",
        });
        const revalidateData = await revalidateResponse.json();

        console.log("Sessão revalidada após PUT:", revalidateData);

        if (revalidateData.user) {
          updateUserData(revalidateData.user);

          // Atualiza o contexto local para exibir dados atualizados imediatamente
          setUserFromDatabase(revalidateData.user);

          // Atualiza sem recarregar
          router.refresh();
        }
      } catch (err) {
        console.error("Erro ao revalidar sessão após PUT:", err);
        // Continua mesmo se a revalidação falhar
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar perfil",
      );
    } finally {
      setIsPending(false);
    }
  }

  // Função para lidar com o upload de avatar
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verifica o tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("O arquivo deve ter no máximo 5MB");
      return;
    }

    // Verifica o tipo do arquivo
    if (!file.type.startsWith("image/")) {
      toast.error("O arquivo deve ser uma imagem");
      return;
    }

    setIsUploadingAvatar(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64String = e.target?.result as string;

        const response = await fetch("/api/user/avatar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            avatarBase64: base64String,
          }),
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || "Erro ao atualizar avatar");
        }

        const result = await response.json();

        // Atualiza o contexto com o novo avatar
        updateUserData({
          ...result,
          avatar_url: result.avatar_url,
        });

        // Atualiza o estado local
        setUserFromDatabase(result);

        toast.success("Avatar atualizado com sucesso!");

        // Recarrega a página para mostrar o novo avatar
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erro ao atualizar avatar",
        );
      } finally {
        setIsUploadingAvatar(false);
      }
    };

    reader.readAsDataURL(file);
  };

  // Função para acionar o input de arquivo
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Função para gerar as iniciais do nome do usuário para o fallback do avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoadingFreshData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 animate-pulse rounded-full bg-muted"></div>
          <div className="space-y-2">
            <div className="h-4 w-[200px] animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-[150px] animate-pulse rounded bg-muted"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <div className="relative">
          <Avatar
            className="h-24 w-24 cursor-pointer"
            onClick={handleAvatarClick}
          >
            {currentUser?.avatar_url ? (
              <AvatarImage
                src={currentUser.avatar_url}
                alt={currentUser.name}
              />
            ) : (
              <AvatarFallback className="text-lg">
                {currentUser?.name ? getInitials(currentUser.name) : "?"}
              </AvatarFallback>
            )}
          </Avatar>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/jpeg,image/png,image/gif"
            className="hidden"
          />

          <div className="absolute -bottom-2 -right-2 rounded-full bg-primary p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary-foreground"
            >
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </div>

          {isUploadingAvatar && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30">
              <svg
                className="h-6 w-6 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium">{currentUser?.name}</h3>
          <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Clique na imagem para atualizar seu avatar
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome" {...field} />
                </FormControl>
                <FormDescription>
                  Este é o nome que será exibido no seu perfil.
                </FormDescription>
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
                  <Input placeholder="seu.email@exemplo.com" {...field} />
                </FormControl>
                <FormDescription>
                  Seu endereço de email. Ao alterar, você precisará fazer login
                  novamente.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <Button
              type="submit"
              disabled={isPending || !form.formState.isDirty}
            >
              {isPending ? "Salvando..." : "Salvar alterações"}
            </Button>
            <DeleteAccountDialog />
          </div>
        </form>
      </Form>
    </div>
  );
}
