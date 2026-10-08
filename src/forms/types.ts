export interface FieldConfig {
  /** Unique within this form. Also used as the submitted field name. */
  name: string;
  type: "text" | "email" | "tel" | "textarea" | "checkbox" | "select";
  label: string;
  required?: boolean;
  requiredMessage?: string;
  validation?: "dni" | "nie" | "passport" | "document";
  /** Name of the select that determines the document validation. */
  validationField?: string;
  helpText?: string;
  placeholder?: string;
  autocomplete?: string;
  maxLength?: number;
  rows?: number;
  fullWidth?: boolean;
  options?: { value: string; label: string }[];
}

export interface FormConfig {
  fields: FieldConfig[];
  legend: string;
  submitLabel?: string;
  note?: string;
  accessKey?: string;
  subject?: string;
  successMessage?: string;
}
