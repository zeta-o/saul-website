"use client";

import { useState, useTransition } from "react";

import { enviarCodigo, verificarCodigo, type LoginState } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const notaCls = "text-sm leading-[1.45] text-white/55";

export function LoginForm({ errorInicial }: { errorInicial?: string }) {
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [state, setState] = useState<LoginState>({ error: errorInicial });
  const [pending, startTransition] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      setState(state.enviado ? await verificarCodigo(correo, codigo) : await enviarCodigo(correo));
    });
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3">
      <Input
        type="email"
        autoComplete="email"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        placeholder="Correo"
        aria-label="Correo"
        readOnly={state.enviado}
        className={state.enviado ? "opacity-60" : undefined}
      />
      {!state.enviado ? (
        <>
          <span className={notaCls}>Si tu correo tiene acceso, te enviaremos un código de 6 dígitos o un enlace para entrar.</span>
          <Button type="submit" disabled={pending} className="mt-1.5 self-start">
            {pending ? "Enviando…" : "Recibir código"}
          </Button>
        </>
      ) : (
        <>
          <Input
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            maxLength={6}
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Código de acceso"
            aria-label="Código de acceso"
            className="tracking-[.2em]"
          />
          <span className={notaCls}>
            Revisa tu correo (y la carpeta de spam). Escribe el código o abre el enlace en este mismo navegador. Vence en 10 minutos.
          </span>
          <div className="mt-1.5 flex items-center gap-4">
            <Button type="submit" disabled={pending}>
              {pending ? "Verificando…" : "Entrar"}
            </Button>
            <button
              type="button"
              onClick={() => {
                setState({});
                setCodigo("");
              }}
              className="cursor-pointer text-sm text-white/55 underline-offset-4 hover:text-white hover:underline"
            >
              Usar otro correo
            </button>
          </div>
        </>
      )}
      <span role="status" aria-live="polite" className="text-sm leading-[1.4] font-medium text-brand-orange">
        {state.error}
      </span>
    </form>
  );
}
