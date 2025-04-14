"use client";

import { icons, LucideProps } from "lucide-react";

interface DynamicIconProps extends Omit<LucideProps, "name"> {
  name: string | null;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  if (!name) return null;

  const IconComponent = icons[name];
  if (!IconComponent) return null;

  return <IconComponent {...props} />;
}
