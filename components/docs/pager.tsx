import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface PagerProps {
  prev?: {
    title: string;
    href: string;
  };
  next?: {
    title: string;
    href: string;
  };
}

export function Pager({ prev, next }: PagerProps) {
  return (
    <div className="flex items-center justify-between">
      {prev ? (
        <Link
          href={prev.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "gap-1 text-base font-medium",
          )}
        >
          <ChevronLeftIcon className="size-4" />
          {prev.title}
        </Link>
      ) : (
        <div />
      )}
      {next && (
        <Link
          href={next.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "gap-1 text-base font-medium",
          )}
        >
          {next.title}
          <ChevronRightIcon className="size-4" />
        </Link>
      )}
    </div>
  );
}
