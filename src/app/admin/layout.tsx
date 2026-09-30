import type { Metadata } from "next";

import { Toaster } from "sonner";

import { barlow } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin · Saúl Vargas" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="es" className={barlow.variable}>
      <body className="bg-mapa">
        {children}
        <Toaster theme="dark" position="top-right" toastOptions={{ style: { fontFamily: "var(--font-barlow)", fontSize: 16 } }} />
      </body>
    </html>
  );
}
