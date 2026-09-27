import test from "node:test";
import assert from "node:assert/strict";
import { validateLogin, validateRegistration } from "../public/auth-validation.js";

test("login validation requires a username or email and password", () => {
  assert.match(validateLogin({ username: " ", password: "secret" }), /username or email/);
  assert.match(validateLogin({ username: "sam", password: "" }), /password/);
  assert.equal(validateLogin({ username: "sam@example.com", password: "secret" }), null);
});

test("registration validation requires every field", () => {
  assert.match(
    validateRegistration({
      username: "sam",
      email: "sam@example.com",
      password: "secret",
      confirmPassword: "",
    }),
    /complete all fields/,
  );
});

test("registration validation rejects mismatched passwords", () => {
  assert.match(
    validateRegistration({
      username: "sam",
      email: "sam@example.com",
      password: "secret",
      confirmPassword: "different",
    }),
    /Passwords do not match/,
  );
});

test("registration validation accepts complete matching details", () => {
  assert.equal(
    validateRegistration({
      username: "sam",
      email: "sam@example.com",
      password: "secret",
      confirmPassword: "secret",
    }),
    null,
  );
});
