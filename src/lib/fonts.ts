import { Barlow_Condensed } from "next/font/google";
import localFont from "next/font/local";

export const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-barlow",
  display: "swap",
});

/** Fuente de marca. Disponible como `font-brand`. */
export const velocity = localFont({
  src: "../fonts/Saul-Vargas-Velocity.ttf",
  variable: "--font-velocity",
  display: "swap",
});
