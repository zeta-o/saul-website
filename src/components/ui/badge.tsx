import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] leading-none font-semibold tracking-[.12em] whitespace-nowrap uppercase",
  {
    variants: {
      variant: {
        neutral: "border-white/15 text-white/60",
        orange: "border-brand-orange/40 bg-brand-orange/15 text-brand-orange",
        blue: "border-brand-blue-light/40 bg-brand-blue/20 text-brand-blue-light",
        green: "border-emerald-400/40 bg-emerald-500/15 text-emerald-300",
        red: "border-red-400/40 bg-red-500/15 text-red-300",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
