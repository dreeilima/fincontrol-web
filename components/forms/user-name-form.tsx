"use client";

import { useState, useTransition } from "react";
import { updateUserName, type FormData } from "@/actions/update-user-name";
import { zodResolver } from "@hookform/resolvers/zod";
import { users } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { userNameSchema } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";

interface UserNameFormProps {
  user: Pick<users, "id" | "name">;
}

export function UserNameForm({ user }: UserNameFormProps) {
  const { update } = useSession();
  const [updated, setUpdated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const updateUserNameWithId = updateUserName.bind(null, user.id);

  const checkUpdate = (value) => {
    setUpdated(user.name !== value);
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userNameSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const { status } = await updateUserNameWithId(data);

      if (status !== "success") {
        toast.error("Algo deu errado.", {
          description:
            "Seu nome não foi atualizado. Por favor, tente novamente.",
        });
      } else {
        await update();
        setUpdated(false);
        toast.success("Seu nome foi atualizado.");
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <SectionColumns
        title="Seu Nome"
        description="Por favor, entre com um nome de exibição que você se sinta confortável."
      >
        <div className="flex w-full items-center gap-2">
          <Label className="sr-only" htmlFor="name">
            Nome
          </Label>
          <Input
            id="name"
            className="flex-1"
            size={32}
            {...register("name")}
            onChange={(e) => checkUpdate(e.target.value)}
          />
          <Button
            type="submit"
            variant={updated ? "default" : "disable"}
            disabled={isPending || !updated}
            className="w-[67px] shrink-0 px-0 sm:w-[130px]"
          >
            {isPending ? (
              <Icons.spinner className="size-4 animate-spin" />
            ) : (
              <p>
                Salvar
                <span className="hidden sm:inline-flex">&nbsp;Alterações</span>
              </p>
            )}
          </Button>
        </div>
        <div className="flex flex-col justify-between p-1">
          {errors?.name && (
            <p className="pb-0.5 text-[13px] text-red-600">
              {errors.name.message}
            </p>
          )}
          <p className="text-[13px] text-muted-foreground">
            Máximo 32 caracteres
          </p>
        </div>
      </SectionColumns>
    </form>
  );
}
