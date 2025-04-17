"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface ControlledLoadingProps {
  size?: "sm" | "md" | "lg" | "xl" | "default" | "fullScreen";
  className?: string;
  fullScreen?: boolean;
  isLoading: boolean; // Controle externo do estado de loading
  minDisplayTime?: number; // Tempo mínimo em milissegundos para exibir o loading
}

export function ControlledLoading({
  size = "md",
  className,
  fullScreen = false,
  isLoading,
  minDisplayTime = 2000, // 2 segundos por padrão
}: ControlledLoadingProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      // Quando isLoading se torna true, mostramos o loading
      setVisible(true);

      // Se isLoading se tornar false, ainda mantemos o loading visível pelo tempo mínimo
      if (!isLoading) {
        const timer = setTimeout(() => {
          setVisible(false);
        }, minDisplayTime);

        return () => clearTimeout(timer);
      }
    } else {
      // Se já passou o tempo mínimo quando isLoading se torna false, escondemos o loading
      const timer = setTimeout(() => {
        setVisible(false);
      }, minDisplayTime);

      return () => clearTimeout(timer);
    }
  }, [isLoading, minDisplayTime]);

  // Definir tamanhos com base no parâmetro size
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
    fullScreen: "w-96 h-96",
    default: "w-64 h-64",
  };

  // Se não estiver visível, não renderiza nada
  if (!visible) {
    return null;
  }

  // Se for fullScreen, criar um overlay que cobre toda a tela
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm duration-300 animate-in fade-in">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-bounce">
            <Image
              src="/cofrinho.gif"
              alt="Carregando..."
              width={96}
              height={96}
              className={cn(sizeMap[size], className)}
              priority
              unoptimized // Garante que o GIF seja exibido em loop
            />
          </div>
          <p className="animate-pulse text-sm text-muted-foreground">
            Carregando...
          </p>
        </div>
      </div>
    );
  }

  // Versão normal (não fullScreen)
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="animate-bounce">
        <Image
          src="/cofrinho.gif"
          alt="Carregando..."
          width={64}
          height={64}
          className={cn(sizeMap[size])}
          priority
          unoptimized // Garante que o GIF seja exibido em loop
        />
      </div>
    </div>
  );
}
