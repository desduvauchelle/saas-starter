/**
 * Unit tests for email templates.
 */

import { describe, it, expect } from "vitest";
import {
  welcomeEmail,
  passwordResetEmail,
  verificationEmail,
  subscriptionConfirmationEmail,
  paymentFailedEmail,
  contactFormEmail,
} from "@/lib/email/templates";

describe("welcomeEmail", () => {
  it("includes the user name in greeting", () => {
    const email = welcomeEmail("Alice");
    expect(email.subject).toContain("Welcome");
    expect(email.html).toContain("Hi Alice,");
    expect(email.text).toContain("Hi Alice,");
  });

  it("uses fallback greeting when name is empty", () => {
    const email = welcomeEmail("");
    expect(email.html).toContain("Hi there,");
  });

  it("includes dashboard link", () => {
    const email = welcomeEmail("Bob");
    expect(email.html).toContain("/app/dashboard");
    expect(email.text).toContain("/app/dashboard");
  });
});

describe("passwordResetEmail", () => {
  it("includes reset URL", () => {
    const url = "http://localhost:3000/reset-password?token=abc";
    const email = passwordResetEmail("Alice", url);
    expect(email.html).toContain(url);
    expect(email.text).toContain(url);
    expect(email.subject).toContain("Reset");
  });
});

describe("verificationEmail", () => {
  it("includes verify URL", () => {
    const url = "http://localhost:3000/verify-email?token=xyz";
    const email = verificationEmail("Bob", url);
    expect(email.html).toContain(url);
    expect(email.text).toContain(url);
  });
});

describe("subscriptionConfirmationEmail", () => {
  it("includes plan name", () => {
    const email = subscriptionConfirmationEmail("Alice", "Pro Plan");
    expect(email.subject).toContain("Pro Plan");
    expect(email.html).toContain("Pro Plan");
  });
});

describe("paymentFailedEmail", () => {
  it("includes billing link", () => {
    const email = paymentFailedEmail("Bob", "Basic Plan");
    expect(email.html).toContain("/app/account/billing");
    expect(email.subject).toContain("Payment failed");
  });
});

describe("contactFormEmail", () => {
  it("includes all form fields", () => {
    const email = contactFormEmail({
      name: "User",
      email: "user@example.com",
      subject: "Help",
      message: "I need help",
    });
    expect(email.html).toContain("User");
    expect(email.html).toContain("user@example.com");
    expect(email.html).toContain("I need help");
    expect(email.subject).toContain("Help");
  });
});
