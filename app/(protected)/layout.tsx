import { redirect } from "next/navigation";

import { sidebarLinks } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/session";
import {
  DashboardSidebar,
  MobileSheetSidebar,
} from "@/components/layout/dashboard-sidebar";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { UserAccountNav } from "@/components/layout/user-account-nav";
import { ProtectedUserProvider } from "@/components/providers-protected";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { UserDataRefresh } from "@/components/shared/user-data-refresh";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  console.log("User role:", user.role); // Debug log

  const filteredLinks = sidebarLinks.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      if (!item.authorizeOnly) return true;
      return item.authorizeOnly.toLowerCase() === user.role.toLowerCase(); // Comparação case-insensitive
    }),
  }));

  console.log("Filtered links:", filteredLinks); // Debug log

  return (
    <ProtectedUserProvider user={user}>
      <UserDataRefresh autoRefresh={false}>
        <div className="relative flex min-h-screen w-full">
          <DashboardSidebar links={filteredLinks} />

          <div className="flex flex-1 flex-col">
            <header className="sticky top-0 z-50 flex h-14 bg-background px-4 lg:h-[60px] xl:px-8">
              <MaxWidthWrapper className="flex max-w-7xl items-center justify-end gap-x-3 px-0">
                <MobileSheetSidebar links={filteredLinks} />
                <ModeToggle />
                <UserAccountNav />
              </MaxWidthWrapper>
            </header>

            <main className="flex-1 p-4 xl:px-8">
              <MaxWidthWrapper className="flex h-full max-w-7xl flex-col gap-4 px-0 lg:gap-6">
                {children}
              </MaxWidthWrapper>
            </main>
          </div>
        </div>
      </UserDataRefresh>
    </ProtectedUserProvider>
  );
}
