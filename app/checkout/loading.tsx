import { Loader2 } from "lucide-react";

import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function CheckoutLoading() {
  return (
    <MaxWidthWrapper className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="size-12 animate-spin text-muted-foreground" />
        <p className="text-lg text-muted-foreground">
          Processando pagamento...
        </p>
      </div>
    </MaxWidthWrapper>
  );
}
