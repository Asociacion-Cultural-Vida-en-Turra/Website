# Website

Public website for Asociación Cultural y Medioambiental "Vida en Turra".

## Requirements

- Node.js `v22.12.0` or higher.

## Installation

Run the following command to install the project dependencies:

```sh
npm install
```

## Running the project

Run the following commands from the project's root folder:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Adding posts

Create a `.md` file in `src/content/blog/` using a lowercase filename with
hyphens between words, for example `village-festival.md`:

```markdown
---
title: "Village festival"
category: "Activities"
date: "2026-09-26"
description: "How we celebrated our village festival."
coverLines: ["A village", "celebrates."]
tone: "sage"
---

Write the article content here.
```

### Post metadata

Define metadata in the YAML frontmatter between the opening `---` lines.
The collection schema in `src/content.config.ts` validates these fields:

| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `title` | String | Yes | — | Post title. Must not be empty after trimming whitespace. |
| `category` | String | Yes | — | Category used to generate filters. Must not be empty after trimming whitespace; `Todas` is reserved for the filter that shows all posts. |
| `date` | String | Yes | — | Valid calendar date in `YYYY-MM-DD` format, written in quotes. Used for chronological sorting and the displayed date. |
| `description` | String | Yes | — | Summary displayed on the card. Must not be empty after trimming whitespace. |
| `image` | String (local image path) | No | None | Path relative to the Markdown file. Astro resolves the image for optimization. Takes priority over the text cover. |
| `imageAlt` | String | No | `""` | Alternative text describing the image. Leave empty only for decorative images. |
| `coverLines` | Array of strings | No | `[]` | Text cover content when no image is provided. Each item appears on a separate line. |
| `tone` | String: `"sage"` or `"cream"` | No | `"sage"` | Background color variant for the text cover. Has no effect when an image is provided. |

## Creating forms

Forms are defined through configuration without modifying their components:

- `src/forms/types.ts`: the `FormConfig` and `FieldConfig` types.
- `src/components/Form.astro`: form structure, events and messages.
- `src/components/FormField.astro`: controls, labels and styles for each field.
- `src/forms/validation.ts`: validation rules.
- `src/forms/contact.ts` and `src/forms/membership.ts`: existing examples.

### 1. Define the fields

Create `src/forms/activity.ts`. The order of the `fields` array determines the display order.

```ts
import type { FormConfig } from "./types";

export const activityForm = {
  legend: "Suggest an activity",
  submitLabel: "Send proposal",
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
      required: true,
      requiredMessage: "Enter your name.",
      autocomplete: "name",
      maxLength: 120,
    },
    {
      name: "email",
      type: "email",
      label: "Email address",
      required: true,
      autocomplete: "email",
    },
    {
      name: "activity",
      type: "select",
      label: "Activity type",
      required: true,
      options: [
        { value: "cultural", label: "Cultural" },
        { value: "environmental", label: "Environmental" },
      ],
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      maxLength: 2000,
      fullWidth: true,
    },
  ],
} satisfies FormConfig;
```

### 2. Use the form on a page

For example, in `src/pages/proponer.astro`:

```astro
---
import Layout from "@layouts/Layout.astro";
import Form from "@components/Form.astro";
import { activityForm } from "../forms/activity";
---

<Layout title="Suggest an activity">
  <main>
    <h1>Suggest an activity</h1>
    <Form {...activityForm} />
  </main>
</Layout>
```

Adjust the import path if the page is in a subfolder. You can include multiple forms on a page: each instance generates its own identifiers.

### Form options

All options except `id` belong to `FormConfig`. Pass `id` directly to `<Form>`.
Actual default strings are shown in Spanish because that is the application's language. Example labels above are in English for documentation purposes; they do not change built-in messages or the page language.

| Option | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `fields` | `FieldConfig[]` | Yes | — | Ordered list of fields to render and validate. |
| `legend` | `string` | Yes | — | Accessible name for the group of fields. Visually hidden; add a visible heading on the page. |
| `submitLabel` | `string` | No | `"Enviar"` | Text of the button that starts validation. |
| `note` | `string` | No | `"Los campos indicados como opcionales pueden dejarse vacíos. El envío aún no está disponible."` | Visible notice below the button, associated with the form through `aria-describedby`. |
| `validMessage` | `string` | No | `"Los datos son válidos. El envío aún no está disponible; no se ha enviado ningún dato."` | Message announced when all fields pass validation. Does not indicate an actual submission. |
| `id` | `string` | No | `form-` followed by a UUID | Form identifier and prefix for its field IDs. If specified, it must be unique on the page. Example: `<Form id="activity-form" {...activityForm} />`. |

### Field options

| Option | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `string` | Yes | — | Field identifier within the form. Must be unique, non-empty and contain no whitespace. Also used as the HTML `name` attribute. |
| `type` | `string` | Yes | — | Control type. Supported values are listed in the next table. |
| `label` | `string` | Yes | — | Visible field label. For optional fields, the component appends “(opcional)”. |
| `required` | `boolean` | No | Not required | Requires a non-empty value, a selected option or a checked checkbox. Whitespace-only text is treated as empty. |
| `requiredMessage` | `string` | No | `"Completa este campo."`; for checkboxes, `"Debes marcar esta casilla."` | Custom message for a missing required value. Does not override format errors. |
| `validation` | `string` | No | No additional rule | Document rule: `dni`, `nie`, `passport` or `document`. Used with text fields; each value is described below. |
| `validationField` | `string` | No; needed with `validation: "document"` | No dependency | `name` of the select in the same form that determines the document type. Its values must be `dni`, `nie` or `passport`. |
| `helpText` | `string` | No | No text | Visible instructions below the control, associated with it for screen readers. |
| `placeholder` | `string` | No | No text; for `select`, `"Selecciona una opción"` | Hint for text inputs and textareas. For a select, this is the initial empty option. Does not apply to checkboxes. |
| `autocomplete` | `string` | No | No explicit attribute | Autofill hint for `text`, `email` and `tel` controls. Examples: `name`, `given-name`, `family-name`, `email`, `tel`. |
| `maxLength` | `number` | No | No configured limit | Maximum character count for `text`, `email`, `tel` and `textarea`. Does not apply to selects or checkboxes. Use a non-negative integer. Document rules may impose additional limits. |
| `rows` | `number` | No | `5` | HTML row count for a `textarea`. Its height also depends on CSS. Does not affect other controls. |
| `fullWidth` | `boolean` | No | One column | When `true`, spans both columns at screen widths of `48rem` and above. All fields stack on smaller screens. |
| `options` | `{ value: string; label: string }[]` | Not required by the type; needed to offer choices in a `select` | No options | Ordered list of select options. Not used by other controls. |
| `options[].value` | `string` | Yes, for each option | — | Internal option value. Use distinct, non-empty values: the empty value is reserved for the initial placeholder. |
| `options[].label` | `string` | Yes, for each option | — | Visible option text, independent of its internal value. |

### Supported `type` values

| Value | Control and behavior |
| :--- | :--- |
| `text` | Single-line text input. Can use an additional document validation rule. |
| `email` | Email input. Format is checked using the browser's native validity state. |
| `tel` | Telephone input. Non-empty values require 7–15 digits; a leading `+`, spaces, periods, hyphens and parentheses are allowed. |
| `textarea` | Multiline text. Supports `rows` and `maxLength`. |
| `checkbox` | Checkbox with its label. Must be checked when required. |
| `select` | Dropdown defined by `options`, with an initial empty option. When required, an option with a non-empty value must be selected. |

### Supported `validation` values

These rules check the entered number's format; they do not verify identity or document authenticity.

| Value | Validation |
| :--- | :--- |
| `dni` | Eight digits followed by a letter, without internal separators. Checks the control letter using the remainder of dividing the number by 23. Accepts lowercase and uppercase letters. |
| `nie` | X, Y or Z prefix, seven digits and a control letter. Replaces the prefix with 0, 1 or 2 to calculate the letter. Accepts lowercase and uppercase letters. |
| `passport` | General check for 3–20 unaccented Latin letters or digits, without internal separators. Does not apply issuing-country-specific rules. |
| `document` | Applies `dni`, `nie` or `passport` based on the select named by `validationField`. Shows an error if no valid type is selected. |

Example of dependent fields within `fields`:

```ts
{
  name: "documentType",
  type: "select",
  label: "Document type",
  required: true,
  options: [
    { value: "dni", label: "DNI" },
    { value: "nie", label: "NIE" },
    { value: "passport", label: "Passport" },
  ],
},
{
  name: "documentNumber",
  type: "text",
  label: "Document number",
  required: true,
  maxLength: 20,
  validation: "document",
  validationField: "documentType",
},
```

Changing the select revalidates the dependent field if it already contains a value or has been validated. Empty optional fields are accepted; populated optional fields must satisfy their validation rules.

### Validation and submission

Errors appear when leaving a field and update as they are corrected. Clicking the button validates all fields and moves focus to the first invalid field. Selects and checkboxes are also validated when they change.

Currently, forms **only validate in the browser: they do not submit or store data, or collect payments**. They remain disabled until JavaScript initializes. Run `npm test` to check the validation rules.
