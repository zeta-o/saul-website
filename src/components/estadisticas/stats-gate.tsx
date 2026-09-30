"use client";

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

export function StatsGate({ lang }: { lang: Locale }) {
  const unlocked = useStatsStore((s) => s.unlocked);
  return unlocked ? <Unlocked lang={lang} /> : <Locked lang={lang} />;
}

function Locked({ lang }: { lang: Locale }) {
  const t = statsCopy[lang];
  const modo = useStatsStore((s) => s.modo);
  const setModo = useStatsStore((s) => s.setModo);

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
  const { correo, clave, codigoEnviado, setField, setError, codigoPedido, unlock } = useStatsStore();

  // Versión estática: simula el flujo del prototipo (sin envío real del código).
  const pedirCodigo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(correo.trim())) return setError(t.errorCorreo);
    codigoPedido();
  };
  const entrar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clave.trim()) return setError(t.errorCodigo);
    unlock();
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
      />
      {!codigoEnviado ? (
        <>
          <span className={notaCls}>{t.loginNota}</span>
          <Button type="submit" className="mt-1.5 self-start">{t.enviarCodigo}</Button>
          <div className="my-0.5 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/18" />
            <span className="text-xs leading-none font-semibold tracking-[.14em] text-white/45 uppercase">{t.o}</span>
            <span className="h-px flex-1 bg-white/18" />
          </div>
          <Button type="button" variant="google" size="google" className="mt-0.5 w-full" onClick={unlock}>
            <GoogleLogo />
            {t.google}
          </Button>
        </>
      ) : (
        <>
          <Input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            value={clave}
            onChange={(e) => setField("clave", e.target.value)}
            placeholder={t.claveLabel}
            aria-label={t.claveLabel}
            className="tracking-[.2em]"
          />
          <span className={notaCls}>{t.codigoNota}</span>
          <Button type="submit" className="mt-1.5 self-start">{t.entrar}</Button>
        </>
      )}
      <Mensaje />
    </form>
  );
}

function SolicitarForm({ lang }: { lang: Locale }) {
  const t = statsCopy[lang];
  const { nombre, correo, rol, social, updates, setField, setError } = useStatsStore();

  // Versión estática: valida y muestra confirmación; aún no se guarda en backend.
  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return setError(t.errorNombre);
    if (!EMAIL_RE.test(correo.trim())) return setError(t.errorCorreo);
    setError(t.enviado);
  };

  return (
    <form onSubmit={enviar} noValidate className="flex max-w-[420px] flex-col gap-3">
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
      <Button type="submit" className="mt-1.5 self-start">{t.solicitar}</Button>
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

function Unlocked({ lang }: { lang: Locale }) {
  const t = statsCopy[lang];
  const groups = STATS[lang];
  return (
    <section className="mx-auto max-w-[1200px] animate-year-in px-4 pt-12 pb-24 md:px-8">
      <span className={`${eyebrowCls} mb-3`}>{t.accesoOk}</span>
      <PageTitle className="mb-9">{nav[lang].stats}</PageTitle>
      {groups.map((g) => (
        <div key={g.titulo} className="mb-10">
          <h2 className="mt-0 mb-[18px] text-[11px] leading-none font-semibold tracking-[.16em] text-white/50 uppercase">{g.titulo}</h2>
          <dl className="m-0 grid grid-cols-2 gap-6 md:grid-cols-4">
            {g.metrics.map((m) => (
              <div key={m.label} className="flex flex-col gap-1.5 border-t-2 border-brand-blue pt-3">
                <dt className={`${metricLabelCls} text-white/50`}>{m.label}</dt>
                <dd className="m-0 text-[32px] leading-none font-bold text-white">{m.value}</dd>
                {m.nota && <dd className="m-0 text-sm leading-[1.3] font-medium text-white/55">{m.nota}</dd>}
              </div>
            ))}
          </dl>
        </div>
      ))}
      <p className="m-0 max-w-[560px] text-[15px] leading-[1.5] text-white/50">{t.disclaimer}</p>
    </section>
  );
}

function GoogleLogo() {
  return (
    <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-2.8-.4-4H24v7.3h12.1c-.2 2-1.6 5-4.5 7l-.1.3 6.6 5.1.4.1c4.2-3.9 6.6-9.6 6.6-15.8z" />
      <path fill="#34A853" d="M24 46c6 0 11-2 14.6-5.4l-7-5.4c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.8-3.8-12.5-9.1l-.3.1-6.9 5.3-.1.3C7.8 41 15.3 46 24 46z" />
      <path fill="#FBBC05" d="M11.5 28.3c-.5-1.4-.7-2.8-.7-4.3s.3-3 .7-4.3v-.4l-7-5.4-.2.1A22 22 0 0 0 2 24c0 3.6.9 6.9 2.3 9.9l7.2-5.6z" />
      <path fill="#EA4335" d="M24 9.5c4.1 0 6.9 1.8 8.5 3.3l6.2-6C34.9 3.4 30 1.4 24 1.4 15.3 1.4 7.8 6.4 4.3 13.7l7.2 5.6C13.2 13.9 18.2 9.5 24 9.5z" />
    </svg>
  );
}
