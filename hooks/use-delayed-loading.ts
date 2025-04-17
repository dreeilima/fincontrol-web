"use client";

import { useEffect, useState } from "react";

interface UseDelayedLoadingOptions {
  minDisplayTime?: number; // Tempo mínimo em milissegundos para exibir o loading
  initialState?: boolean; // Estado inicial do loading
}

/**
 * Hook personalizado para gerenciar o estado de loading com um tempo mínimo de exibição
 * @param options Opções de configuração
 * @returns Um array com o estado de loading e funções para controlar o loading
 */
export function useDelayedLoading({
  minDisplayTime = 2000, // 2 segundos por padrão
  initialState = false,
}: UseDelayedLoadingOptions = {}) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [shouldShow, setShouldShow] = useState(initialState);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // Efeito para gerenciar o tempo mínimo de exibição
  useEffect(() => {
    if (isLoading) {
      // Se começou a carregar, mostra imediatamente
      setShouldShow(true);

      // Limpa qualquer timer existente
      if (timer) {
        clearTimeout(timer);
        setTimer(null);
      }
    } else if (!isLoading && shouldShow) {
      // Se parou de carregar mas ainda está mostrando, espera o tempo mínimo
      const newTimer = setTimeout(() => {
        setShouldShow(false);
      }, minDisplayTime);

      setTimer(newTimer);

      // Limpa o timer quando o componente for desmontado
      return () => {
        if (newTimer) clearTimeout(newTimer);
      };
    }
  }, [isLoading, shouldShow, minDisplayTime, timer]);

  // Função para iniciar o loading
  const startLoading = () => setIsLoading(true);

  // Função para parar o loading
  const stopLoading = () => setIsLoading(false);

  // Função para alternar o estado de loading
  const toggleLoading = () => setIsLoading((prev) => !prev);

  return {
    isLoading, // Estado atual do loading
    shouldShow, // Se deve mostrar o loading (considerando o tempo mínimo)
    startLoading, // Função para iniciar o loading
    stopLoading, // Função para parar o loading
    toggleLoading, // Função para alternar o loading
  };
}
