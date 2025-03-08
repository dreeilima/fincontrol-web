import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { RelatorioCharts } from "@/components/relatorio/charts";
import { RelatorioFilters } from "@/components/relatorio/filters";
import { RelatorioOverview } from "@/components/relatorio/overview";

export default async function RelatorioPage() {
  return (
    <DashboardShell>
      <DashboardHeader />
      <div className="grid gap-8">
        <RelatorioFilters /> {/* Filtros de período e categoria */}
        <RelatorioOverview /> {/* Cards com totais do período */}
        <RelatorioCharts /> {/* Gráficos financeiros */}
      </div>
    </DashboardShell>
  );
}
