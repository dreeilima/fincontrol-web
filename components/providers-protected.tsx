"use client";

import { ReactNode, useEffect, useState } from "react";
import { useUser } from "@/contexts/user-context";
import { UserWithoutToken } from "@/types";

interface ProtectedUserProviderProps {
  children: ReactNode;
  user: any; // Aceita qualquer tipo de usuário
}

// Este componente inicializa o contexto do usuário com os dados do usuário
export function ProtectedUserProvider({
  children,
  user,
}: ProtectedUserProviderProps) {
  const { userData, updateUserData } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);

  // Função para verificar se os dados do servidor estão atualizados
  // comparando com os dados do contexto
  const checkServerDataSync = async () => {
    try {
      // Verifica se os dados do usuário no servidor estão atualizados
      const response = await fetch("/api/user/check", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const latestUser = await response.json();
        console.log("Verificação de sincronização:", {
          serverName: user?.name,
          latestName: latestUser?.name,
        });

        // Se os dados do servidor estiverem desatualizados, atualiza o contexto
        if (latestUser && latestUser.name !== user?.name) {
          console.log(
            "Dados desatualizados no servidor, atualizando contexto...",
          );
          updateUserData(latestUser);
        }
      }
    } catch (error) {
      console.error("Erro ao verificar sincronização:", error);
    }
  };

  // Atualiza os dados do usuário no contexto
  useEffect(() => {
    if (user && (!userData || userData.id !== user.id || !isInitialized)) {
      console.log("Inicializando contexto protegido com:", user.name);

      // Converte o usuário para o formato esperado
      const formattedUser: UserWithoutToken = {
        id: user.id,
        name: user.name || "",
        email: user.email || "",
        role: user.role === "ADMIN" ? "admin" : "user",
        phone: user.phone || null,
        stripe_customer_id: user.stripe_customer_id || null,
        stripe_subscription_id: user.stripe_subscription_id || null,
        stripe_price_id: user.stripe_price_id || null,
        stripe_current_period_end: user.stripe_current_period_end || null,
        image: user.image || null,
        avatar_url: user.avatar_url || null,
      };

      updateUserData(formattedUser);
      setIsInitialized(true);

      // Verifica se os dados do servidor estão sincronizados
      checkServerDataSync();
    }
  }, [user, userData, updateUserData, isInitialized]);

  return <>{children}</>;
}
