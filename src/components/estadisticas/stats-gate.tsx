"use client";

import { useEffect, useState, useTransition } from "react";

import { enviarCodigoStats, solicitarAcceso, verificarCodigoStats, type LoginError } from "@/app/[lang]/estadisticas/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PageTitle } from "@/components/site/inner-page";
import { UnderlineTabs } from "@/components/site/tabs";
import { STATS, statsCopy } from "@/content/estadisticas";
import { EMAIL_RE, nav, type Locale } from "@/lib/i18n";
import { useStatsStore, type StatsModo } from "@/stores/stats-store";

const eyebrowCls = "block text-xs leading-none font-semibold tracking-[.16em] text-brand-orange uppercase";
const notaCls = "text-sm leading-[1.45] text-white/55";
const metricLabelCls = "text-[10px] leading-none font-semibold tracking-[.16em] uppercase";

export type StatsAviso = "enlace" | "sinAcceso";

/** Página bloqueada: iniciar sesión (entrenadores con acceso) o solicitar acceso. */
export function StatsGate({ lang, aviso }: { lang: Locale; aviso?: StatsAviso }) {
  const t = statsCopy[lang];
  const modo = useStatsStore((s) => s.modo);
  const setModo = useStatsStore((s) => s.setModo);
  const setError = useStatsStore((s) => s.setError);

  // Aviso que llega desde el servidor (enlace vencido, acceso revocado).
  useEffect(() => {
    if (aviso) setError(aviso === "enlace" ? t.errorEnlace : t.errorSinAcceso);
  }, [aviso, setError, t]);

  return (
    <section className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-4 pt-10 pb-24 md:px-8 md:pt-16 lg:grid-cols-2 lg:gap-16">
      <div>
        <span className={`${eyebrowCls} mb-3.5`}>{t.privado}</span>
        <PageTitle className="mb-[18px] text-[clamp(36px,5vw,54px)]">{nav[lang].stats}</PageTitle>
        <p className="mt-0 mb-6 max-w-[440px] text-lg leading-[1.6] text-white/75">{t.gateTexto}</p>

        <UnderlineTabs<StatsModo>
          items={[
            { value: "login", label: t.login },
            { value: "solicitar", label: t.solicitar },
          ]}
          value={modo}
          onChange={setModo}
          label={nav[lang].stats}
          className="mb-[22px] gap-[26px] text-[13px] tracking-[.12em] [&>button]:pb-[7px]"
        />

        {modo === "login" ? <LoginForm lang={lang} /> : <SolicitarForm lang={lang} />}
      </div>

      <Teaser lang={lang} />
    </section>
  );
}

function Mensaje() {
  const error = useStatsStore((s) => s.error);
  return (
    <span role="status" aria-live="polite" className="text-sm leading-[1.4] font-medium text-brand-orange">
      {error}
    </span>
  );
}

function LoginForm({ lang }: { lang: Locale }) {
  const t = statsCopy[lang];
  const { correo, clave, codigoEnviado, setField, setError, codigoPedido, otroCorreo } = useStatsStore();
  const [pending, startTransition] = useTransition();

  const mensaje: Record<LoginError, string> = {
    correo: t.errorCorreo,
    codigo: t.errorCodigo,
    sinAcceso: t.errorSinAcceso,
    limite: t.errorLimite,
    servidor: t.errorServidor,
  };

  const pedirCodigo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(correo.trim())) return setError(t.errorCorreo);
    startTransition(async () => {
      const res = await enviarCodigoStats(correo, lang);
      if (res.enviado) codigoPedido();
      else if (res.error) setError(mensaje[res.error]);
    });
  };
  const entrar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(clave.replace(/\s/g, ""))) return setError(t.errorCodigo);
    startTransition(async () => {
      // Si el código es correcto, la acción redirige y la página se muestra desbloqueada.
      const res = await verificarCodigoStats(correo, clave, lang);
      if (res?.error) {
        setError(mensaje[res.error]);
        if (res.error === "sinAcceso") otroCorreo();
      }
    });
  };

  return (
    <form onSubmit={codigoEnviado ? entrar : pedirCodigo} noValidate className="flex max-w-[420px] flex-col gap-3">
      <Input
        type="email"
        autoComplete="email"
        value={correo}
        onChange={(e) => setField("correo", e.target.value)}
        placeholder={t.correoLabel}
        aria-label={t.correoLabel}
        readOnly={codigoEnviado}
        className={codigoEnviado ? "opacity-60" : undefined}
      />
      {!codigoEnviado ? (
        <>
          <span className={notaCls}>{t.loginNota}</span>
          <Button type="submit" disabled={pending} className="mt-1.5 self-start">
            {pending ? t.enviandoCodigo : t.enviarCodigo}
          </Button>
        </>
      ) : (
        <>
          <Input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            maxLength={6}
            value={clave}
            onChange={(e) => setField("clave", e.target.value)}
            placeholder={t.claveLabel}
            aria-label={t.claveLabel}
            className="tracking-[.2em]"
          />
          <span className={notaCls}>{t.codigoNota}</span>
          <div className="mt-1.5 flex items-center gap-4">
            <Button type="submit" disabled={pending}>
              {pending ? t.verificando : t.entrar}
            </Button>
            <button
              type="button"
              onClick={otroCorreo}
              className="cursor-pointer text-sm text-white/55 underline-offset-4 hover:text-white hover:underline"
            >
              {t.otroCorreo}
            </button>
          </div>
        </>
      )}
      <Mensaje />
    </form>
  );
}

function SolicitarForm({ lang }: { lang: Locale }) {
  const t = statsCopy[lang];
  const { nombre, correo, rol, social, updates, setField, setError } = useStatsStore();
  const [website, setWebsite] = useState("");
  const [pending, startTransition] = useTransition();

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return setError(t.errorNombre);
    if (!EMAIL_RE.test(correo.trim())) return setError(t.errorCorreo);
    startTransition(async () => {
      const res = await solicitarAcceso({ nombre, correo, rol, social, updates, website });
      if (res.ok) return setError(t.enviado);
      setError(res.error === "nombre" ? t.errorNombre : res.error === "correo" ? t.errorCorreo : t.errorServidor);
    });
  };

  return (
    <form onSubmit={enviar} noValidate className="relative flex max-w-[420px] flex-col gap-3">
      <Input required autoComplete="name" value={nombre} onChange={(e) => setField("nombre", e.target.value)} placeholder={t.nombreReq} aria-label={t.nombreReq} />
      <Input required type="email" autoComplete="email" value={correo} onChange={(e) => setField("correo", e.target.value)} placeholder={t.correoReq} aria-label={t.correoReq} />
      <Input value={rol} autoComplete="organization-title" onChange={(e) => setField("rol", e.target.value)} placeholder={t.rolLabel} aria-label={t.rolLabel} />
      <Input type="url" value={social} autoComplete="url" onChange={(e) => setField("social", e.target.value)} placeholder={t.socialLabel} aria-label={t.socialLabel} />
      <label className="mt-1 flex cursor-pointer items-start gap-2.5">
        <Checkbox checked={updates} onCheckedChange={(v) => setField("updates", v === true)} className="mt-[3px]" />
        <span className="flex flex-col gap-1">
          <span className="text-base leading-[1.3] font-medium text-white/85">{t.updatesLabel}</span>
          <span className={notaCls}>{t.updatesNota}</span>
        </span>
      </label>
      {/* Trampa para bots: oculto para personas y lectores de pantalla */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <Button type="submit" disabled={pending} className="mt-1.5 self-start">
        {pending ? t.enviando : t.solicitar}
      </Button>
      <Mensaje />
    </form>
  );
}

function Teaser({ lang }: { lang: Locale }) {
  const t = statsCopy[lang];
  const teaser = STATS[lang][1].metrics;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/12 p-8" aria-label={t.bloqueado}>
      <div className="grid grid-cols-2 gap-6 opacity-50 blur-[7px] select-none" aria-hidden="true">
        {teaser.map((m) => (
          <div key={m.label} className="flex flex-col gap-1.5 border-t-2 border-brand-blue pt-3">
            <span className={`${metricLabelCls} text-white/55`}>{m.label}</span>
            <span className="text-[30px] leading-none font-bold text-white">{m.value}</span>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-[rgba(30,30,30,.35)]">
        <span className="text-[13px] leading-none font-semibold tracking-[.18em] text-white/85 uppercase">{t.bloqueado}</span>
      </div>
    </div>
  );
}
