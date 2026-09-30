"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_EMAIL, contactCopy } from "@/content/contacto";
import { EMAIL_RE, type Locale } from "@/lib/i18n";

/**
 * Versión estática: valida y abre el cliente de correo con el mensaje.
 * Más adelante se conecta a un endpoint (Supabase / Resend).
 */
export function ContactForm({ lang }: { lang: Locale }) {
  const t = contactCopy[lang];
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [status, setStatus] = useState("");

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return setStatus(t.errorNombre);
    if (!EMAIL_RE.test(correo.trim())) return setStatus(t.errorCorreo);
    if (!mensaje.trim()) return setStatus(t.errorMensaje);
    const subject = encodeURIComponent(`${nombre.trim()} — saulvargas.com`);
    const body = encodeURIComponent(`${mensaje.trim()}\n\n${nombre.trim()} <${correo.trim()}>`);
    setStatus(t.enviado);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-3.5">
      <Input autoComplete="name" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder={t.nombre} aria-label={t.nombre} className="placeholder:text-white/50" />
      <Input type="email" autoComplete="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder={t.correo} aria-label={t.correo} className="placeholder:text-white/50" />
      <Textarea rows={5} value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder={t.mensaje} aria-label={t.mensaje} className="placeholder:text-white/50" />
      <Button type="submit" variant="accent" size="accent" className="mt-1.5 self-start">{t.enviar}</Button>
      <span role="status" aria-live="polite" className="text-sm leading-[1.4] font-medium text-brand-orange">{status}</span>
    </form>
  );
}
