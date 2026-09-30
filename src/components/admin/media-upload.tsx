"use client";

import { useRef, useState } from "react";
import { ImagePlusIcon, Loader2Icon, VideoIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { MEDIA_BUCKET, mediaUrl } from "@/lib/supabase/config";
import { cn } from "@/lib/utils";

const MAX_MB = 50;

/**
 * Sube un archivo directo al bucket "media" (la sesión del admin lo autoriza por RLS)
 * y devuelve su ruta. El borrado del archivo anterior lo hace el server action al guardar.
 */
export function MediaUpload({
  value,
  onChange,
  folder,
  kind = "image",
  className,
  label,
}: {
  value: string | null;
  onChange: (path: string | null) => void;
  folder: string;
  kind?: "image" | "video";
  className?: string;
  label?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const url = mediaUrl(value);

  async function upload(file: File) {
    if (file.size > MAX_MB * 1024 * 1024) return toast.error(`El archivo pesa más de ${MAX_MB} MB.`);
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || (kind === "video" ? "mp4" : "jpg");
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await createClient()
      .storage.from(MEDIA_BUCKET)
      .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
    setUploading(false);
    if (error) return toast.error(`No se pudo subir: ${error.message}`);
    onChange(path);
  }

  const Icon = kind === "video" ? VideoIcon : ImagePlusIcon;

  return (
    <div
      className={cn(
        "group relative flex min-h-[140px] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/20 bg-white/[.04]",
        className
      )}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) void upload(file);
      }}
    >
      {url ? (
        kind === "video" ? (
          <video src={url} muted playsInline controls className="h-full max-h-[280px] w-full bg-[#111] object-contain" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- vista previa en el admin
          <img src={url} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={uploading}
          className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 p-4 text-white/55 outline-none hover:text-white focus-visible:text-white"
        >
          {uploading ? <Loader2Icon className="size-6 animate-spin" /> : <Icon className="size-6" strokeWidth={1.5} />}
          <span className="text-xs leading-none font-semibold tracking-[.12em] uppercase">
            {uploading ? "Subiendo…" : label ?? (kind === "video" ? "Subir video" : "Subir foto")}
          </span>
          {!uploading && <span className="text-xs text-white/35">o arrastra el archivo aquí</span>}
        </button>
      )}
      {url && (
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="cursor-pointer rounded-md bg-black/70 px-2.5 py-1.5 text-xs font-semibold tracking-[.08em] text-white uppercase hover:bg-black"
          >
            {uploading ? "Subiendo…" : "Cambiar"}
          </button>
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Quitar"
            className="flex cursor-pointer items-center rounded-md bg-black/70 px-1.5 text-white hover:bg-red-600"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      )}
      <input
        ref={input}
        type="file"
        hidden
        accept={kind === "video" ? "video/mp4,video/webm" : "image/jpeg,image/png,image/webp,image/avif"}
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void upload(file);
        }}
      />
    </div>
  );
}
