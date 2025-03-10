import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { features } from "@/config/landing";
import { Button } from "@/components/ui/button";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function Features() {
  return (
    <section className="bg-slate-50/50 dark:bg-slate-950/50">
      <div className="pb-16 pt-24">
        <MaxWidthWrapper>
          <HeaderSection
            label="Recursos"
            title="Ferramentas Financeiras Completas"
            subtitle="Descubra todas as funcionalidades que tornam o Fincontrol a escolha ideal para sua gestão financeira"
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = Icons[feature.icon || "chart"];
              return (
                <div
                  className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all hover:shadow-lg"
                  key={feature.title}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 -translate-y-1/2 rounded-full bg-gradient-to-b from-green-500/20 to-green-600/20 opacity-0 blur-2xl transition-all duration-300 group-hover:opacity-100"
                  />

                  <div className="relative space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
                        <Icon className="size-5 text-green-500" />
                      </div>
                      <h3 className="font-medium text-blue-900 dark:text-white">
                        {feature.title}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-500">
                      {feature.description}
                    </p>

                    <div className="pt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="group/btn -ml-2 h-9 text-blue-900 hover:bg-green-500/10 hover:text-green-500 dark:text-white"
                      >
                        <Link
                          href={feature.link || "/"}
                          className="flex items-center gap-2"
                        >
                          <span>Saiba mais</span>
                          <ArrowUpRight className="size-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </MaxWidthWrapper>
      </div>
    </section>
  );
}
