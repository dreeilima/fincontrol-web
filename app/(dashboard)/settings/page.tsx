import { auth } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { PreferencesSettings } from "@/components/settings/preferences-settings";
import { SecuritySettings } from "@/components/settings/security-settings";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie suas configurações de conta e preferências.
        </p>
      </div>
      <Separator />
      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>
        <TabsContent value="notifications" className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Notificações</h3>
            <p className="text-sm text-muted-foreground">
              Configure como você deseja receber notificações.
            </p>
          </div>
          <Separator />
          <NotificationSettings user={session.user} />
        </TabsContent>
        <TabsContent value="preferences" className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Preferências</h3>
            <p className="text-sm text-muted-foreground">
              Personalize sua experiência no aplicativo.
            </p>
          </div>
          <Separator />
          <PreferencesSettings user={session.user} />
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Segurança</h3>
            <p className="text-sm text-muted-foreground">
              Atualize suas configurações de segurança.
            </p>
          </div>
          <Separator />
          <SecuritySettings user={session.user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
