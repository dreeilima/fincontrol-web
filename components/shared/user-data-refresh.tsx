"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@/contexts/user-context";

interface UserDataRefreshProps {
  children: React.ReactNode;
  // Se definido como true, atualiza os dados a cada intervalo de tempo
  autoRefresh?: boolean;
  // Intervalo de atualização em milissegundos (padrão: 60s)
  refreshInterval?: number;
}

/**
 * Componente que garante que os dados do usuário estejam atualizados.
 * Pode ser usado em qualquer parte da aplicação que exiba dados do usuário.
 */
export function UserDataRefresh({
  children,
  autoRefresh = false,
  refreshInterval = 60000, // Aumentado para 60 segundos
}: UserDataRefreshProps) {
  const { refreshUserData, updateUserData, lastUpdated, userData } = useUser();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const lastRefreshTimeRef = useRef<number>(0);
  const isRefreshingRef = useRef<boolean>(false);
  const refreshCountRef = useRef<number>(0);

  // Função com throttle para evitar chamadas excessivas
  const throttledRefresh = async () => {
    const now = Date.now();

    // Verifica se já temos dados no sessionStorage
    const cachedData = sessionStorage.getItem("userData");
    const lastStorageUpdate = sessionStorage.getItem("userDataUpdated");

    // Se temos dados em cache e eles são recentes (menos de 30 segundos), use-os
    if (
      cachedData &&
      lastStorageUpdate &&
      now - parseInt(lastStorageUpdate) < 30000
    ) {
      try {
        const parsedData = JSON.parse(cachedData);
        console.log("Usando dados do usuário em cache do sessionStorage");
        updateUserData(parsedData);
        return;
      } catch (e) {
        console.error("Erro ao processar dados em cache:", e);
      }
    }

    // Verifica se passou tempo suficiente desde a última atualização (pelo menos 5 segundos)
    // e limita o número de chamadas a 5 por sessão
    if (
      now - lastRefreshTimeRef.current < 5000 ||
      isRefreshingRef.current ||
      (refreshCountRef.current >= 5 && !isFirstRender)
    ) {
      console.log("Refresh ignorado devido ao throttle ou limite de chamadas");
      return;
    }

    isRefreshingRef.current = true;
    lastRefreshTimeRef.current = now;
    refreshCountRef.current += 1;

    try {
      // Obtenha dados do usuário
      const userResponse = await refreshUserData();

      // Se a chamada foi bem-sucedida e retornou dados
      if (userResponse) {
        // Verificar se a resposta foi throttled
        const isThrottled =
          "throttled" in userResponse && userResponse.throttled === true;

        if (!isThrottled) {
          // Armazene os dados no sessionStorage para uso futuro
          sessionStorage.setItem("userData", JSON.stringify(userResponse));
          sessionStorage.setItem("userDataUpdated", now.toString());
        }
      }
    } finally {
      isRefreshingRef.current = false;
    }
  };

  // Atualiza os dados apenas na primeira montagem
  useEffect(() => {
    if (isFirstRender) {
      throttledRefresh();
      setIsFirstRender(false);
    }
  }, [isFirstRender]);

  // Se autoRefresh estiver ativo, atualiza os dados periodicamente
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      throttledRefresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Adiciona um event listener para o evento de atualização de dados
  useEffect(() => {
    const handleUserDataUpdated = (event: CustomEvent) => {
      // Evita atualizações desnecessárias
      if (isRefreshingRef.current) return;

      console.log("Evento de atualização de dados recebido:", event.detail);
      if (event.detail?.user) {
        updateUserData(event.detail.user);

        // Atualiza o cache
        sessionStorage.setItem("userData", JSON.stringify(event.detail.user));
        sessionStorage.setItem("userDataUpdated", Date.now().toString());
      }
    };

    // Adiciona o event listener tipado corretamente
    window.addEventListener(
      "user-data-updated",
      handleUserDataUpdated as EventListener,
    );

    return () => {
      window.removeEventListener(
        "user-data-updated",
        handleUserDataUpdated as EventListener,
      );
    };
  }, [updateUserData]);

  return <>{children}</>;
}
