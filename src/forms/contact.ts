import type { FormConfig } from "./types";

export const contactForm = {
  legend: "Formulario de contacto",
  submitLabel: "Enviar mensaje",
  note: "Todos los campos son obligatorios. El envío aún no está disponible.",
  validMessage:
    "Los datos son válidos. El envío aún no está disponible; tu mensaje no se ha enviado.",
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nombre",
      autocomplete: "name",
      placeholder: "Tu nombre",
      maxLength: 120,
      required: true,
      requiredMessage: "Escribe tu nombre.",
    },
    {
      name: "email",
      type: "email",
      label: "Correo electrónico",
      autocomplete: "email",
      placeholder: "tu@correo.es",
      maxLength: 254,
      required: true,
      requiredMessage: "Escribe tu correo electrónico.",
    },
    {
      name: "message",
      type: "textarea",
      label: "Mensaje",
      placeholder: "Cuéntanos tu idea…",
      maxLength: 5000,
      required: true,
      requiredMessage: "Escribe un mensaje.",
      fullWidth: true,
    },
    {
      name: "privacy",
      type: "checkbox",
      label: "He leído y acepto la política de privacidad.",
      required: true,
      requiredMessage: "Debes aceptar la política de privacidad.",
      fullWidth: true,
    },
  ],
} satisfies FormConfig;
