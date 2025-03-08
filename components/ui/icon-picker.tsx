"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Icons } from "../shared/icons";

interface IconPickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um ícone" />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(Icons).map((name) => (
          <SelectItem key={name} value={name}>
            <div className="flex items-center gap-2">
              {/* @ts-ignore */}
              {Icons[name] && React.createElement(Icons[name], { size: 16 })}
              <span>{name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
