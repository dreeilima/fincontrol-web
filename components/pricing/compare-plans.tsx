import { PlansRow } from "@/types";
import { CircleCheck, Info } from "lucide-react";

import { comparePlans, plansColumns } from "@/config/subscriptions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HeaderSection } from "@/components/shared/header-section";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export function ComparePlans() {
  const renderCell = (value: string | boolean | null, column?: string) => {
    if (value === null) return "—";
    if (typeof value === "boolean") {
      return value ? (
        <CircleCheck
          className={`mx-auto size-[22px] ${column === "premium" ? "text-green-500" : ""}`}
        />
      ) : (
        "—"
      );
    }

    // Destacar valores especiais
    if (typeof value === "string") {
      // Valores do plano Premium
      if (column === "premium") {
        if (value.toUpperCase() === "ILIMITADO") {
          return (
            <span className="text-lg font-bold text-green-500">{value}</span>
          );
        }
        if (value.toLowerCase() === "incluído") {
          return (
            <span className="text-lg font-bold text-green-500">{value}</span>
          );
        }
        return (
          <span className="text-lg font-bold text-green-600">{value}</span>
        );
      }

      // Valores do plano Básico
      if (column === "basic") {
        if (value.toLowerCase() === "incluído") {
          return (
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {value}
            </span>
          );
        }
        if (value.includes("10 por mês")) {
          return (
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {value}
            </span>
          );
        }
        if (value.includes("basic") || value.includes("Basic")) {
          return (
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {value}
            </span>
          );
        }
        if (value === "Email") {
          return (
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {value}
            </span>
          );
        }
        if (value === "CSV básico") {
          return (
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {value}
            </span>
          );
        }
        if (value === "Mensais básicos") {
          return (
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {value}
            </span>
          );
        }
        if (value === "Automática básica") {
          return (
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {value}
            </span>
          );
        }
        // Qualquer outro valor do plano básico
        return (
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {value}
          </span>
        );
      }
    }

    return value;
  };

  return (
    <MaxWidthWrapper>
      <HeaderSection
        label="Planos Mensais"
        title="Compare nossos planos"
        subtitle="Escolha o plano mensal ideal para suas necessidades financeiras"
      />

      <div className="mx-auto my-10 max-w-4xl overflow-x-scroll max-lg:mx-[-0.8rem] md:overflow-x-visible">
        <table className="w-full table-fixed border-separate border-spacing-0 overflow-hidden rounded-lg shadow-md">
          <thead>
            <tr className="divide-x divide-border border border-gray-200 dark:border-gray-800">
              <th className="sticky left-0 z-20 w-48 bg-background p-5 text-center font-heading text-lg md:w-1/3 lg:top-14">
                Recursos
              </th>
              {plansColumns.map((col) => (
                <th
                  key={col}
                  className={`sticky z-10 w-40 p-5 font-heading text-xl capitalize tracking-wide md:w-auto lg:top-14 lg:text-2xl ${col === "premium" ? "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400" : "bg-blue-50/70 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300"}`}
                >
                  {col === "premium" ? (
                    <div className="flex flex-col items-center">
                      <span className="mb-1 rounded-md bg-green-500 px-2 py-0.5 text-xs font-bold text-white">
                        RECOMENDADO
                      </span>
                      {col}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="mb-1 rounded-md bg-blue-500 px-2 py-0.5 text-xs font-bold text-white">
                        GRATUITO
                      </span>
                      {col}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border border border-gray-200 dark:border-gray-800">
            {comparePlans.map((row: PlansRow, index: number) => (
              <tr
                key={index}
                className="divide-x divide-border border border-gray-200 dark:border-gray-800"
              >
                <td
                  data-tip={row.tooltip ? row.tooltip : ""}
                  className="sticky left-0 w-48 bg-background font-medium text-black dark:text-white md:w-1/3"
                  style={{ verticalAlign: "middle" }}
                >
                  <div className="flex items-center px-4 py-5">
                    <div className="flex-grow text-left text-base font-medium lg:text-lg">
                      {row.feature}
                    </div>
                    {row.tooltip && (
                      <div className="ml-2 flex-shrink-0">
                        <Popover>
                          <PopoverTrigger className="flex-shrink-0 rounded p-1 hover:bg-muted">
                            <Info className="size-[18px] text-muted-foreground" />
                          </PopoverTrigger>
                          <PopoverContent
                            side="top"
                            className="max-w-80 p-3 text-sm"
                          >
                            {row.tooltip}
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </div>
                </td>
                {plansColumns.map((col) => (
                  <td
                    key={col}
                    className={`px-4 py-5 text-center text-base lg:text-lg ${col === "premium" ? "bg-green-50/50 font-medium text-green-700 dark:bg-green-950/20 dark:text-green-400" : "bg-blue-50/70 font-medium text-blue-800 dark:bg-blue-950/30 dark:text-blue-300"}`}
                    style={{ verticalAlign: "middle" }}
                  >
                    {renderCell(row[col], col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 text-center">
          <div className="flex flex-col gap-6 md:flex-row md:justify-center md:gap-10">
            <div className="text-center">
              <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                Comece gratuitamente com o plano Básico
              </p>
              <p className="mt-2 text-muted-foreground">
                Ideal para quem está começando a organizar suas finanças
              </p>
              <div className="mt-4">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full border border-blue-500 bg-transparent px-6 py-2 text-sm font-medium text-blue-600 shadow-sm transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/20"
                >
                  Criar conta gratuita
                </a>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg font-medium text-green-600 dark:text-green-400">
                O plano Premium oferece o melhor custo-benefício
              </p>
              <p className="mt-2 text-muted-foreground">
                Apenas <span className="font-bold">R$ 19,90 por mês</span> para
                ter controle total das suas finanças
              </p>
              <div className="mt-4">
                <a
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full bg-green-500 px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-600"
                >
                  Assinar agora
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
