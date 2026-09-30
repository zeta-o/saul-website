import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { getAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Entrar" };

export default async function AdminLoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px]">
        <Image src="/images/logo.png" alt="Saúl Vargas" width={1289} height={1220} className="mb-8 h-[53px] w-auto" priority />
        <span className="mb-3.5 block text-xs leading-none font-semibold tracking-[.16em] text-brand-orange uppercase">
          Administración
        </span>
        <h1 className="mt-0 mb-6 text-[clamp(36px,5vw,48px)] leading-none font-extrabold tracking-[-.02em] uppercase italic">
          Entrar
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
