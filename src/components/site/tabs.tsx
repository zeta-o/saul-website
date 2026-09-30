"use client";

import { cn } from "@/lib/utils";

/** Tabs subrayadas del diseño (Galería, Estadísticas). */
export function UnderlineTabs<T extends string>({
  items,
  value,
  onChange,
  label,
  className,
}: {
  items: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div role="tablist" aria-label={label} className={cn("flex font-semibold leading-none uppercase", className)}>
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.value)}
            className={cn(
              "cursor-pointer border-b-2 bg-transparent uppercase transition-colors outline-none focus-visible:text-white",
              selected ? "border-brand-orange text-white" : "border-transparent text-white/50 hover:text-white/80"
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
