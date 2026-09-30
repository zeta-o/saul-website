import type { Locale } from "@/lib/i18n";

export const CONTACT_EMAIL = "contacto@saulvargas.com";

export const contactCopy = {
  es: {
    nombre: "Nombre", correo: "Correo", mensaje: "Mensaje", enviar: "Enviar",
    pitch: "¿Interesado en apoyar a Saúl? Escríbenos para hablar de patrocinio, equipo o cualquier oportunidad.",
    errorNombre: "Escribe tu nombre para continuar.",
    errorCorreo: "Escribe un correo válido para continuar.",
    errorMensaje: "Escribe un mensaje para continuar.",
    enviado: "Mensaje listo. Se abrirá tu cliente de correo para enviarlo.",
  },
  en: {
    nombre: "Name", correo: "Email", mensaje: "Message", enviar: "Send",
    pitch: "Interested in supporting Saúl? Reach out to talk about sponsorship, team opportunities, or anything else.",
    errorNombre: "Enter your name to continue.",
    errorCorreo: "Enter a valid email to continue.",
    errorMensaje: "Write a message to continue.",
    enviado: "Message ready. Your email app will open so you can send it.",
  },
} satisfies Record<Locale, Record<string, string>>;
