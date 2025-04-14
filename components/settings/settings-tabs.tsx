"use client";

import { User as NextAuthUser } from "next-auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AppearanceSettings } from "./appearance-settings";
import { NotificationSettings } from "./notification-settings";
import { SecuritySettings } from "./security-settings";
import { UserSettings } from "./user-settings";

// Omitir a propriedade token do tipo User
type UserWithoutToken = Omit<NextAuthUser, "token"> & {
  phone: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  stripe_current_period_end: Date | null;
};

interface SettingsTabsProps {
  user: UserWithoutToken;
}

interface TabComponent {
  user: UserWithoutToken;
}

const TABS = [
  {
    id: "profile",
    label: "Perfil",
    title: "Informações do Perfil",
    description: "Atualize suas informações pessoais e preferências",
    component: UserSettings as React.ComponentType<TabComponent>,
  },
  {
    id: "notifications",
    label: "Notificações",
    title: "Preferências de Notificação",
    description: "Configure como e quando deseja receber notificações",
    component: NotificationSettings as React.ComponentType<TabComponent>,
  },
  {
    id: "security",
    label: "Segurança",
    title: "Segurança da Conta",
    description: "Gerencie sua senha e configurações de segurança",
    component: SecuritySettings as React.ComponentType<TabComponent>,
  },
  {
    id: "appearance",
    label: "Aparência",
    title: "Aparência",
    description: "Personalize a aparência do FinControl",
    component: AppearanceSettings as React.ComponentType<TabComponent>,
  },
] as const;

export function SettingsTabs({ user }: SettingsTabsProps) {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-4 md:w-[600px]">
        {TABS.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {TABS.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{tab.title}</CardTitle>
              <CardDescription>{tab.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <tab.component user={user} />
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
