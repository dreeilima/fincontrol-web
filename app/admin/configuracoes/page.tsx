import { SystemSettings } from "@/components/admin/system-settings";

export default function ConfiguracoesPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-2xl font-bold">Configurações do Sistema</h1>
      <SystemSettings />
    </div>
  );
}
