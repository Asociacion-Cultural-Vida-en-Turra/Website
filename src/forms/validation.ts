import type { FieldConfig } from "./types";

type FieldValue = Pick<
  FieldConfig,
  "type" | "required" | "requiredMessage" | "maxLength" | "validation"
> & {
  value: string;
  checked?: boolean;
  typeMismatch?: boolean;
  documentType?: string;
};

/** Returns an empty string when the value is valid. No field names are assumed. */
export function getFieldError(field: FieldValue): string {
  if (field.type === "checkbox") {
    return field.required && !field.checked
      ? (field.requiredMessage ?? "Debes marcar esta casilla.")
      : "";
  }

  if (!field.value.trim()) {
    return field.required
      ? (field.requiredMessage ?? "Completa este campo.")
      : "";
  }

  if (field.typeMismatch) {
    return "Introduce un correo electrónico válido, como tu@correo.es.";
  }

  const validation =
    field.validation === "document" ? field.documentType : field.validation;
  if (
    field.validation === "document" &&
    !["dni", "nie", "passport"].includes(validation ?? "")
  ) {
    return "Selecciona primero el tipo de documento.";
  }

  if (validation === "dni") {
    const dni = field.value.trim().toUpperCase();
    if (!/^\d{8}[A-Z]$/.test(dni)) {
      return "Introduce un DNI con 8 números y una letra, sin separadores.";
    }
    const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
    if (letters[Number(dni.slice(0, 8)) % 23] !== dni[8]) {
      return "La letra del DNI no corresponde al número. Revisa tu DNI.";
    }
  }

  if (validation === "nie") {
    const nie = field.value.trim().toUpperCase();
    if (!/^[XYZ]\d{7}[A-Z]$/.test(nie)) {
      return "Introduce un NIE con X, Y o Z, 7 números y una letra, sin separadores.";
    }
    const number = Number(String("XYZ".indexOf(nie[0])) + nie.slice(1, 8));
    if ("TRWAGMYFPDXBNJZSQVHLCKE"[number % 23] !== nie[8]) {
      return "La letra del NIE no corresponde al número. Revisa tu NIE.";
    }
  }

  // General format only; passport numbering varies by issuing country.
  if (
    validation === "passport" &&
    !/^[A-Z0-9]{3,20}$/i.test(field.value.trim())
  ) {
    return "Introduce entre 3 y 20 letras o números, sin espacios ni separadores.";
  }

  if (field.type === "tel") {
    const digits = field.value.replace(/\D/g, "").length;
    if (
      !/^\+?[\d\s().-]+$/.test(field.value.trim()) ||
      digits < 7 ||
      digits > 15
    ) {
      return "Introduce un teléfono de entre 7 y 15 dígitos; puedes incluir el prefijo internacional.";
    }
  }

  if (
    field.maxLength !== undefined &&
    field.maxLength >= 0 &&
    field.value.length > field.maxLength
  ) {
    return `Usa un máximo de ${field.maxLength} caracteres.`;
  }

  return "";
}
