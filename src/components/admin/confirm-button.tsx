"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { AdminDialog } from "@/components/admin/admin-dialog";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/admin/common";

/** Botón que pide confirmación antes de una acción destructiva. */
export function ConfirmButton({
  children,
  title,
  description,
  confirmLabel = "Eliminar",
  action,
  onDone,
  variant = "ghost",
  size = "xs",
  className,
  ariaLabel,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  action: () => Promise<ActionResult>;
  onDone?: () => void;
  variant?: "ghost" | "outline" | "danger";
  size?: "xs" | "icon";
  className?: string;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  return (
    <>
      <Button type="button" variant={variant} size={size} className={className} aria-label={ariaLabel} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <AdminDialog open={open} onOpenChange={setOpen} title={title} description={description}>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" size="xs" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            size="xs"
            disabled={pending}
            onClick={() =>
              start(async () => {
                const res = await action();
                if (!res.ok) return void toast.error(res.error);
                setOpen(false);
                onDone?.();
              })
            }
          >
            {pending ? "…" : confirmLabel}
          </Button>
        </div>
      </AdminDialog>
    </>
  );
}
