import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-lg border-none font-semibold uppercase whitespace-nowrap transition-[background-color,opacity] outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-brand-blue text-white hover:bg-brand-blue/90",
        accent: "bg-brand-orange text-white hover:bg-brand-orange/90",
        google: "bg-white text-surface normal-case hover:bg-white/90",
      },
      size: {
        default: "px-[30px] py-[14px] text-[15px] leading-none tracking-[.06em]",
        accent: "px-7 py-[14px] text-[15px] leading-none tracking-[.05em]",
        google: "px-5 py-[13px] text-[15px] leading-none tracking-[.04em]",
        sm: "px-[26px] py-[14px] text-[13px] leading-none tracking-[.1em]",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
