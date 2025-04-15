"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/contexts/user-context";
import { UserWithoutToken } from "@/types";
import { LayoutDashboard, Lock, LogOut, Settings, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Drawer } from "vaul";

import { useMediaQuery } from "@/hooks/use-media-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/shared/user-avatar";

export function UserAccountNav() {
  const { data: session } = useSession();
  const { userData } = useUser();
  // Preferir dados do contexto, depois da sessão
  const user = (userData || session?.user) as UserWithoutToken;
  const { isMobile } = useMediaQuery();
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string>("");
  const [displayEmail, setDisplayEmail] = useState<string>("");

  // Atualize o estado apenas quando os dados do usuário mudarem
  useEffect(() => {
    if (user) {
      setDisplayName(user.name || "");
      setDisplayEmail(user.email || "");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="size-8 animate-pulse rounded-full border bg-muted" />
    );
  }

  const menuItems = (
    <>
      {user.role === "admin" && (
        <Link
          href="/admin"
          className="flex w-full items-center gap-3 px-2.5 py-2 text-foreground hover:bg-muted"
          onClick={() => setOpen(false)}
        >
          <Lock className="size-4" />
          <span className="text-sm">Admin</span>
        </Link>
      )}

      <Link
        href="/dashboard/configuracao"
        className="flex w-full items-center gap-3 px-2.5 py-2 text-foreground hover:bg-muted"
        onClick={() => setOpen(false)}
      >
        <Settings className="size-4" />
        <span className="text-sm">Configurações</span>
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex w-full items-center gap-3 px-2.5 py-2 text-foreground hover:bg-muted"
      >
        <LogOut className="size-4" />
        <span className="text-sm">Sair</span>
      </button>
    </>
  );

  if (isMobile) {
    return (
      <Drawer.Root open={open} onClose={() => setOpen(false)}>
        <Drawer.Trigger asChild onClick={() => setOpen(true)}>
          <button className="transition-transform hover:scale-105 active:scale-95">
            <UserAvatar
              user={{
                name: displayName,
                avatar_url: user.avatar_url || user.image || null,
              }}
              className="size-9 border shadow-sm"
            />
          </button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" />
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 rounded-t-[10px] border bg-background p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <UserAvatar
                  user={{
                    name: displayName,
                    avatar_url: user.avatar_url || user.image || null,
                  }}
                  className="size-10 border shadow-sm"
                />
                <div className="flex flex-col">
                  {displayName && <p className="font-medium">{displayName}</p>}
                  {displayEmail && (
                    <p className="w-[200px] truncate text-muted-foreground">
                      {displayEmail}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-2">{menuItems}</div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="transition-transform hover:scale-105 active:scale-95">
          <UserAvatar
            user={{
              name: displayName,
              avatar_url: user.avatar_url || user.image || null,
            }}
            className="size-8 border shadow-sm"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-2 p-2">
          <UserAvatar
            user={{
              name: displayName,
              avatar_url: user.avatar_url || user.image || null,
            }}
            className="size-8 border shadow-sm"
          />
          <div className="flex flex-col space-y-1">
            {displayName && <p className="font-medium">{displayName}</p>}
            {displayEmail && (
              <p className="truncate text-sm text-muted-foreground">
                {displayEmail}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="flex flex-col">{menuItems}</div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
