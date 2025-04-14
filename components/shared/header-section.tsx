import { cn } from "@/lib/utils";

interface HeaderSectionProps {
  label?: string;
  title: string;
  subtitle?: string;
  labelClassName?: string;
}

export function HeaderSection({
  label,
  title,
  subtitle,
  labelClassName,
}: HeaderSectionProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {label && (
        <span
          className={cn(
            "mb-6 rounded-lg bg-green-500/10 px-3 py-1 text-sm font-medium text-green-500",
            labelClassName,
          )}
        >
          {label}
        </span>
      )}
      <h2 className="font-heading text-3xl md:text-4xl lg:text-[40px]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-6 text-balance text-lg text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
