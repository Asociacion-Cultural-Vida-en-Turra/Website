import test from "node:test";
import assert from "node:assert/strict";
import { getFieldError } from "../src/forms/validation.ts";

test("required selects reject the empty placeholder and accept a selected value", () => {
  assert.notEqual(
    getFieldError({ type: "select", value: "", required: true }),
    "",
  );
  assert.equal(
    getFieldError({ type: "select", value: "15", required: true }),
    "",
  );
  assert.equal(getFieldError({ type: "select", value: "" }), "");
});

test("required fields reject whitespace and use their configured error", () => {
  assert.equal(
    getFieldError({
      type: "text",
      value: "   ",
      required: true,
      requiredMessage: "Indica tu localidad.",
    }),
    "Indica tu localidad.",
  );
  assert.equal(
    getFieldError({ type: "text", value: "  Alba  ", required: true }),
    "",
  );
});

test("optional fields accept empty values without skipping validation of supplied values", () => {
  assert.equal(getFieldError({ type: "tel", value: " " }), "");
  assert.notEqual(getFieldError({ type: "tel", value: "abcdefghi" }), "");
  assert.equal(getFieldError({ type: "tel", value: "+34 923 123 456" }), "");
});

test("checkboxes only require acceptance when configured as required", () => {
  assert.notEqual(
    getFieldError({
      type: "checkbox",
      value: "on",
      required: true,
      checked: false,
    }),
    "",
  );
  assert.equal(
    getFieldError({
      type: "checkbox",
      value: "on",
      required: true,
      checked: true,
    }),
    "",
  );
  assert.equal(
    getFieldError({ type: "checkbox", value: "on", checked: false }),
    "",
  );
});

test("email format errors from the browser are shown", () => {
  assert.notEqual(
    getFieldError({
      type: "email",
      value: "correo-invalido",
      typeMismatch: true,
    }),
    "",
  );
  assert.equal(
    getFieldError({ type: "email", value: "socio@example.com" }),
    "",
  );
});

test("length limits apply to populated optional fields too", () => {
  assert.equal(
    getFieldError({ type: "textarea", value: "Hola", maxLength: 4 }),
    "",
  );
  assert.notEqual(
    getFieldError({ type: "textarea", value: "Hola!", maxLength: 4 }),
    "",
  );
});

test("DNI validates all eight digits and the control letter", () => {
  for (const value of ["12345678Z", "12345678z", "00000001R"]) {
    assert.equal(
      getFieldError({ type: "text", validation: "dni", value, required: true }),
      "",
    );
  }
  for (const value of [
    "12345678A",
    "1234567Z",
    "123456789Z",
    "abcdefghZ",
    "12345678",
    "1234 678Z",
  ]) {
    assert.notEqual(
      getFieldError({ type: "text", validation: "dni", value, required: true }),
      "",
      value,
    );
  }
  assert.notEqual(
    getFieldError({
      type: "text",
      validation: "dni",
      value: "",
      required: true,
    }),
    "",
  );
});

test("DNI validation is opt-in for text fields", () => {
  assert.equal(getFieldError({ type: "text", value: "texto libre" }), "");
});

test("NIE validates X, Y and Z prefixes and their control letters", () => {
  for (const value of ["X1234567L", "Y1234567X", "Z1234567R", "x1234567l"]) {
    assert.equal(
      getFieldError({ type: "text", validation: "nie", value }),
      "",
      value,
    );
  }
  for (const value of [
    "X1234567A",
    "A1234567L",
    "X123456L",
    "X12345678L",
    "12345678Z",
  ]) {
    assert.notEqual(
      getFieldError({ type: "text", validation: "nie", value }),
      "",
      value,
    );
  }
});

test("passport applies a general alphanumeric format check", () => {
  for (const value of ["ABC123456", "123456789", "ab12345"]) {
    assert.equal(
      getFieldError({ type: "text", validation: "passport", value }),
      "",
    );
  }
  for (const value of ["A1", "AB-123456", "AB 123456", "A".repeat(21)]) {
    assert.notEqual(
      getFieldError({ type: "text", validation: "passport", value }),
      "",
    );
  }
});

test("document validation follows the selected type and rejects a missing type", () => {
  const field = {
    type: "text",
    validation: "document",
    value: "X1234567L",
    required: true,
  } as const;
  assert.equal(getFieldError({ ...field, documentType: "nie" }), "");
  assert.notEqual(getFieldError({ ...field, documentType: "dni" }), "");
  assert.equal(getFieldError({ ...field, documentType: "passport" }), "");
  assert.notEqual(getFieldError(field), "");
  assert.notEqual(getFieldError({ ...field, documentType: "unknown" }), "");
});
