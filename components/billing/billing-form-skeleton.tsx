import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BillingFormSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    </Card>
  );
}
