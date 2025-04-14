"use client";

import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex gap-2">
      <Input
        type="color"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-10 w-14 cursor-pointer"
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="#000000"
        className="flex-1"
      />
    </div>
  );
}
