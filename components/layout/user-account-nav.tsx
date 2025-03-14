"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Lock, LogOut, Settings } from "lucide-react";
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
  const user = session?.user;
  const { isMobile } = useMediaQuery();
  const [open, setOpen] = useState(false);

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
        href="/dashboard"
        className="flex w-full items-center gap-3 px-2.5 py-2 text-foreground hover:bg-muted"
        onClick={() => setOpen(false)}
      >
        <LayoutDashboard className="size-4" />
        <span className="text-sm">Dashboard</span>
      </Link>
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
          <button>
            <UserAvatar
              user={{
                name: user.name ?? "",
                avatar_url: user.image ?? null,
              }}
              className="size-9 border"
            />
          </button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" />
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 rounded-t-[10px] border bg-background p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  {user.name && <p className="font-medium">{user.name}</p>}
                  {user.email && (
                    <p className="w-[200px] truncate text-muted-foreground">
                      {user.email}
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
        <button>
          <UserAvatar
            user={{
              name: user.name ?? "",
              avatar_url: user.image ?? null,
            }}
            className="size-8 border"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-2 p-2">
          <div className="flex flex-col space-y-1">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="truncate text-sm text-muted-foreground">
                {user.email}
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
