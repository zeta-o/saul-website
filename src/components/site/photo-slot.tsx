import Image from "next/image";
import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Foto con radio y alto fijos. Sin `src` muestra un marcador
 * (sustituye a los image-slot del prototipo mientras llegan las fotos reales).
 */
export function PhotoSlot({
  src,
  alt,
  placeholder,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority,
}: {
  src?: string;
  alt: string;
  placeholder: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative w-full overflow-hidden rounded-xl", !src && "border border-dashed border-white/15 bg-white/[.04]", className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/35">
          <ImageIcon className="size-6" strokeWidth={1.4} aria-hidden="true" />
          <span className="text-[13px] leading-none font-semibold tracking-[.12em] uppercase">{placeholder}</span>
        </div>
      )}
    </div>
  );
}
