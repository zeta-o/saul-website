"use client";

import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn("text-[11px] leading-none font-semibold tracking-[.14em] text-white/60 uppercase select-none", className)}
      {...props}
    />
  );
}

export { Label };
