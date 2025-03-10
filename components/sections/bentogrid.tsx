import { BarChart3, PieChart, Shield, TrendingUp } from "lucide-react";

import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function BentoGrid() {
  return (
    <section className="py-20">
      <MaxWidthWrapper>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 - Gestão Financeira */}
          <div className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-full bg-green-500/10 p-3">
                <TrendingUp className="size-6 text-green-500" />
              </div>
              <span className="text-2xl font-semibold text-green-500">
                +27%
              </span>
            </div>
            <h3 className="mb-2 font-medium text-foreground">
              Gestão Financeira
            </h3>
            <p className="text-sm text-gray-500">
              Acompanhamento em tempo real do seu patrimônio e investimentos
            </p>
          </div>

          {/* Card 2 - Análise de Mercado */}
          <div className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-full bg-blue-500/10 p-3">
                <BarChart3 className="size-6 text-blue-500" />
              </div>
              <div className="flex gap-1">
                <span className="rounded bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-500">
                  Análise
                </span>
              </div>
            </div>
            <h3 className="mb-2 font-medium text-foreground">
              Análise de Mercado
            </h3>
            <p className="text-sm text-gray-500">
              Insights precisos para tomada de decisões estratégicas
            </p>
          </div>

          {/* Card 3 - Segurança */}
          <div className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-full bg-red-500/10 p-3">
                <Shield className="size-6 text-red-500" />
              </div>
              <div className="flex gap-1">
                <span className="rounded bg-red-500/10 px-2 py-1 text-xs font-medium text-red-500">
                  Protegido
                </span>
              </div>
            </div>
            <h3 className="mb-2 font-medium text-foreground">
              Segurança Avançada
            </h3>
            <p className="text-sm text-gray-500">
              Proteção total dos seus dados e transações financeiras
            </p>
          </div>

          {/* Card 4 - Dashboard */}
          <div className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-full bg-purple-500/10 p-3">
                <PieChart className="size-6 text-purple-500" />
              </div>
              <span className="text-xs font-medium text-gray-500">
                Atualizado
              </span>
            </div>
            <h3 className="mb-2 font-medium text-foreground">
              Dashboard Intuitivo
            </h3>
            <p className="text-sm text-gray-500">
              Visualização clara e objetiva das suas finanças
            </p>
          </div>
        </div>

        {/* Seção de Métricas */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-background p-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-500">
                Retorno Médio
              </h4>
              <span className="text-xs text-gray-400">Últimos 12 meses</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-blue-900 dark:text-white">
                12.8%
              </span>
              <span className="text-sm text-green-500">+2.3%</span>
            </div>
          </div>

          <div className="rounded-lg border bg-background p-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-500">
                Usuários Ativos
              </h4>
              <span className="text-xs text-gray-400">Este mês</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-blue-900 dark:text-white">
                8.942
              </span>
              <span className="text-sm text-orange-500">+12%</span>
            </div>
          </div>

          <div className="rounded-lg border bg-background p-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-500">Transações</h4>
              <span className="text-xs text-gray-400">Hoje</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-blue-900 dark:text-white">
                2.4M
              </span>
              <span className="text-sm text-purple-600">99.9%</span>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
