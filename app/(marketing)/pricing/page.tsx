import { ComparePlans } from "@/components/pricing/compare-plans";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { PricingFAQ } from "@/components/pricing/pricing-faq";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default async function PricingPage() {
  return (
    <>
      <MaxWidthWrapper className="mb-20 mt-24 text-center">
        <div className="mt-16">
          <PricingCards />
        </div>

        <div className="mt-24">
          <ComparePlans />
        </div>

        <div className="mt-24">
          <PricingFAQ />
        </div>
      </MaxWidthWrapper>
    </>
  );
}
