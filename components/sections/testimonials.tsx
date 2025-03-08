"use client";

import { testimonials } from "@/config/landing";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { HeaderSection } from "@/components/shared/header-section";

export default function Testimonials() {
  // Adaptar os dados dos testimonials para o formato esperado pelo AnimatedTestimonials
  const formattedTestimonials = testimonials.map((item) => ({
    quote: item.review,
    name: item.name,
    designation: item.job,
    src: item.image,
  }));

  return (
    <section>
      <div className="container flex max-w-6xl flex-col gap-10 py-32 sm:gap-y-16">
        <HeaderSection
          label="Testimonials"
          title="What our clients are sharing."
          subtitle="Discover the glowing feedback from our delighted customers worldwide."
        />

        <AnimatedTestimonials
          testimonials={formattedTestimonials}
          autoplay={true}
        />
      </div>
    </section>
  );
}
