"use client";

import { useState } from "react";

import { useDelayedLoading } from "@/hooks/use-delayed-loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ControlledLoading } from "@/components/shared/controlled-loading";

export function LoadingExample() {
  const [delayTime, setDelayTime] = useState(2000);
  const { isLoading, shouldShow, startLoading, stopLoading } =
    useDelayedLoading({
      minDisplayTime: delayTime,
    });

  const handleStartLoading = () => {
    startLoading();
    // Simula uma operação que leva 500ms para completar
    setTimeout(() => {
      stopLoading();
    }, 500);
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Exemplo de Loading com Delay</CardTitle>
        <CardDescription>
          Este exemplo mostra como usar o loading com um tempo mínimo de
          exibição
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="delay-time">Tempo mínimo de exibição (ms)</Label>
          <Input
            id="delay-time"
            type="number"
            value={delayTime}
            onChange={(e) => setDelayTime(Number(e.target.value))}
            min={0}
            step={100}
          />
        </div>
        <div className="py-4 text-center">
          {shouldShow && (
            <div className="py-8">
              <ControlledLoading isLoading={shouldShow} size="md" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleStartLoading}
          disabled={isLoading}
          className="w-full"
        >
          Simular Carregamento Rápido (500ms)
        </Button>
      </CardFooter>

      {/* Loading overlay para toda a página */}
      <ControlledLoading
        isLoading={shouldShow}
        fullScreen
        minDisplayTime={delayTime}
      />
    </Card>
  );
}
