"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, DollarSign, TrendingDown, TrendingUp, Users } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MRRData {
  mrr: number;
  mrrChange: number;
  arpu: number; // Average Revenue Per User
  arpuChange: number;
  activeSubscribers: number;
  subscribersChange: number;
  ltv: number; // Lifetime Value
  ltvChange: number;
}

export function MRRMetrics() {
  const [data, setData] = useState<MRRData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMRRData() {
      try {
        // No futuro, buscar da API
        // const response = await fetch("/api/admin/metrics/mrr");
        // const data = await response.json();
        
        // Dados simulados para demonstração
        setData({
          mrr: 12500,
          mrrChange: 15.3,
          arpu: 89.90,
          arpuChange: 5.2,
          activeSubscribers: 139,
          subscribersChange: 12.8,
          ltv: 1078.80,
          ltvChange: 8.5,
        });
      } catch (error) {
        console.error("Erro ao buscar dados de MRR:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMRRData();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px]" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <TooltipProvider>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              MRR
              <Tooltip>
                <TooltipTrigger className="ml-1 cursor-help">
                  <span className="text-xs text-muted-foreground">ⓘ</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Monthly Recurring Revenue - Receita mensal recorrente de todas as assinaturas ativas
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.mrr)}</div>
            <div className="mt-1 flex items-center text-xs">
              {data.mrrChange > 0 ? (
                <>
                  <TrendingUp className="mr-1 size-3 text-emerald-500" />
                  <span className="text-emerald-500">+{data.mrrChange.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 size-3 text-rose-500" />
                  <span className="text-rose-500">{data.mrrChange.toFixed(1)}%</span>
                </>
              )}
              <span className="ml-1 text-muted-foreground">vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              ARPU
              <Tooltip>
                <TooltipTrigger className="ml-1 cursor-help">
                  <span className="text-xs text-muted-foreground">ⓘ</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Average Revenue Per User - Receita média por usuário
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.arpu)}</div>
            <div className="mt-1 flex items-center text-xs">
              {data.arpuChange > 0 ? (
                <>
                  <TrendingUp className="mr-1 size-3 text-emerald-500" />
                  <span className="text-emerald-500">+{data.arpuChange.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 size-3 text-rose-500" />
                  <span className="text-rose-500">{data.arpuChange.toFixed(1)}%</span>
                </>
              )}
              <span className="ml-1 text-muted-foreground">vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Assinantes Ativos
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeSubscribers}</div>
            <div className="mt-1 flex items-center text-xs">
              {data.subscribersChange > 0 ? (
                <>
                  <TrendingUp className="mr-1 size-3 text-emerald-500" />
                  <span className="text-emerald-500">+{data.subscribersChange.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 size-3 text-rose-500" />
                  <span className="text-rose-500">{data.subscribersChange.toFixed(1)}%</span>
                </>
              )}
              <span className="ml-1 text-muted-foreground">vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              LTV
              <Tooltip>
                <TooltipTrigger className="ml-1 cursor-help">
                  <span className="text-xs text-muted-foreground">ⓘ</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Lifetime Value - Valor médio que um cliente gera durante todo seu relacionamento com a empresa
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <ArrowUpRight className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.ltv)}</div>
            <div className="mt-1 flex items-center text-xs">
              {data.ltvChange > 0 ? (
                <>
                  <TrendingUp className="mr-1 size-3 text-emerald-500" />
                  <span className="text-emerald-500">+{data.ltvChange.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 size-3 text-rose-500" />
                  <span className="text-rose-500">{data.ltvChange.toFixed(1)}%</span>
                </>
              )}
              <span className="ml-1 text-muted-foreground">vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>
    </div>
  );
}
