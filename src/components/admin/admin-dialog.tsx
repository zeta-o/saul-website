"use client";

import { XIcon } from "lucide-react";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

/** Diálogo del admin (mismo estilo que el modal "Mi equipo"). */
export function AdminDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  wide,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${wide ? "max-w-[860px]" : "max-w-[560px]"} animate-modal-in rounded-[20px] border border-white/10 bg-panel`}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <div className="flex items-start justify-between gap-6 border-b border-white/10 px-6 pt-6 pb-5">
          <div>
            <DialogTitle className="m-0 text-[26px] leading-none font-extrabold uppercase italic">{title}</DialogTitle>
            <DialogDescription className={description ? "mt-2 mb-0 text-sm text-white/55" : "sr-only"}>
              {description ?? title}
            </DialogDescription>
          </div>
          <DialogClose
            className="flex size-[34px] flex-none cursor-pointer items-center justify-center rounded-full border border-white/20 text-white/70 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-ring/60"
            aria-label="Cerrar"
          >
            <XIcon className="size-4" />
          </DialogClose>
        </div>
        <div className="px-6 py-6">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
