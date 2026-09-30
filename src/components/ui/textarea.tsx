import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full min-w-0 resize-y rounded-lg border border-white/20 bg-white/[.06] px-4 py-[14px] text-base text-white outline-none transition-colors placeholder:text-white/45 focus-visible:border-white/45",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
