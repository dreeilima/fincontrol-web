import { users } from "@prisma/client";
import { AvatarProps } from "@radix-ui/react-avatar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/shared/icons";

interface UserAvatarProps extends AvatarProps {
  user: Pick<users, "avatar_url" | "name">;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  // Função para gerar as iniciais do nome do usuário
  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Avatar {...props}>
      {user.avatar_url ? (
        <AvatarImage
          alt="Picture"
          src={user.avatar_url}
          referrerPolicy="no-referrer"
        />
      ) : (
        <AvatarFallback>
          {user.name ? (
            getInitials(user.name)
          ) : (
            <>
              <span className="sr-only">Usuário</span>
              <Icons.user className="size-4" />
            </>
          )}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
