import { cn } from "@/lib/utils";

interface ComparisonIndicatorProps {
  value: number;
  label?: string;
  className?: string;
}

export default function ComparisonIndicator({
  value,
  label,
  className,
}: ComparisonIndicatorProps) {
  return (
    <p
      className={cn(
        "text-xs",
        value > 0
          ? "text-green-500"
          : value < 0
            ? "text-red-500"
            : "text-muted-foreground",
        className,
      )}
    >
      {value > 0 ? "+" : ""}
      {value}%{label && ` ${label}`}
    </p>
  );
}
