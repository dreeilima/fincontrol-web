import Image from "next/image";
import type { InfoLdg } from "@/types";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

interface InfoLandingProps {
  data: InfoLdg;
  reverse?: boolean;
}

export default function InfoLanding({
  data,
  reverse = false,
}: InfoLandingProps) {
  return (
    <div className="py-10 sm:py-20">
      <MaxWidthWrapper className="grid gap-10 px-2.5 lg:grid-cols-2 lg:items-center lg:px-7">
        <div className={cn(reverse ? "lg:order-2" : "lg:order-1")}>
          <h2 className="font-heading text-2xl text-blue-900 dark:text-white md:text-4xl lg:text-[40px]">
            {data.title}
          </h2>
          <p className="mt-4 text-base text-gray-500">{data.description}</p>
          <dl className="mt-8 space-y-6">
            {data.list.map((item, index) => {
              const Icon = Icons[item.icon || "arrowRight"];
              return (
                <div
                  className="group relative pl-10 transition-all"
                  key={index}
                >
                  <dt className="font-medium text-foreground">
                    <Icon className="absolute left-0 top-1 size-5 text-green-500 transition-transform group-hover:scale-110" />
                    <span>{item.title}</span>
                  </dt>
                  <dd className="mt-1 text-sm text-gray-500">
                    {item.description}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
        <div
          className={cn(
            "overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md lg:-m-4",
            reverse ? "order-1" : "order-2",
          )}
        >
          <div className="aspect-[4/3]">
            <Image
              className="size-full object-cover object-center"
              src={data.image}
              alt={data.title}
              width={1000}
              height={750}
              priority={true}
            />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
