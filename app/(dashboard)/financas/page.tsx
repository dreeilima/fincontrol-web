import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoriesList } from "@/components/financas/categories-list";
import { CategoryDialog } from "@/components/financas/category-dialog";
import { TransactionsList } from "@/components/financas/transactions-list";

export default function FinancasPage() {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Transações</h2>
          </div>
          <TransactionsList />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Categorias</h2>
              <div className="flex items-center gap-2">
                <CategoryDialog type="INCOME" />
                <CategoryDialog type="EXPENSE" />
              </div>
            </div>
            <div className="mt-4">
              <CategoriesList />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
