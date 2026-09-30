import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-0 rounded-lg border border-white/20 bg-white/[.06] px-4 py-[14px] text-base text-white outline-none transition-colors placeholder:text-white/45 focus-visible:border-white/45 aria-invalid:border-brand-orange",
        className
      )}
      {...props}
    />
  );
}

export { Input };
