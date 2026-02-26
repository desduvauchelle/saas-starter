/**
 * Unit tests for API errors.
 */

import { describe, it, expect } from "vitest";
import {
  ApiError,
  NotFoundError,
  ValidationError,
  ConflictError,
  FileTooLargeError,
  UnsupportedMediaError,
} from "@/lib/api/errors";

describe("ApiError", () => {
  it("creates an error with status, code, and message", () => {
    const err = new ApiError("Something went wrong", 500, "SERVER_ERROR");
    expect(err.message).toBe("Something went wrong");
    expect(err.statusCode).toBe(500);
    expect(err.code).toBe("SERVER_ERROR");
    expect(err.name).toBe("ApiError");
  });
});

describe("NotFoundError", () => {
  it("defaults to 404 status and NOT_FOUND code", () => {
    const err = new NotFoundError("User not found");
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe("NOT_FOUND");
  });
});

describe("ValidationError", () => {
  it("includes field-level details", () => {
    const err = new ValidationError({
      email: ["Must be a valid email"],
      name: ["Required"],
    });
    expect(err.statusCode).toBe(422);
    expect(err.code).toBe("VALIDATION_ERROR");
    expect(err.details).toEqual({
      email: ["Must be a valid email"],
      name: ["Required"],
    });
  });
});

describe("ConflictError", () => {
  it("defaults to 409 and CONFLICT code", () => {
    const err = new ConflictError("Email already exists");
    expect(err.statusCode).toBe(409);
    expect(err.code).toBe("CONFLICT");
  });
});

describe("FileTooLargeError", () => {
  it("has FILE_TOO_LARGE code", () => {
    const err = new FileTooLargeError(10 * 1024 * 1024);
    expect(err.statusCode).toBe(413);
    expect(err.code).toBe("FILE_TOO_LARGE");
    expect(err.message).toContain("10MB");
  });
});

describe("UnsupportedMediaError", () => {
  it("has UNSUPPORTED_MEDIA_TYPE code", () => {
    const err = new UnsupportedMediaError("text/plain");
    expect(err.statusCode).toBe(415);
    expect(err.code).toBe("UNSUPPORTED_MEDIA_TYPE");
    expect(err.message).toContain("text/plain");
  });
});
